import {
  Injectable,
  OnModuleInit,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export type TokenPayload = { sub: string; role: 'CUSTOMER' | 'ADMIN'; exp: number };

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  private get secret() {
    return process.env.AUTH_SECRET || 'vf-dev-secret-change-me';
  }

  /** Ensure an admin account exists, using ADMIN_EMAIL / ADMIN_PASSWORD from .env */
  async onModuleInit() {
    const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.warn('⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin account seeded.');
      return;
    }
    await this.prisma.user.upsert({
      where: { email },
      update: { role: 'ADMIN', passwordHash: this.hashPassword(password) },
      create: { email, name: 'V&F Admin', role: 'ADMIN', passwordHash: this.hashPassword(password) },
    });
    console.log(`🔐 Admin account ready: ${email}`);
  }

  hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  verifyPassword(password: string, stored: string) {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return expected.length === candidate.length && timingSafeEqual(expected, candidate);
  }

  signToken(payload: Omit<TokenPayload, 'exp'>) {
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
    const sig = createHmac('sha256', this.secret).update(body).digest('base64url');
    return `${body}.${sig}`;
  }

  verifyToken(token: string): TokenPayload | null {
    const [body, sig] = (token || '').split('.');
    if (!body || !sig) return null;
    const expected = createHmac('sha256', this.secret).update(body).digest('base64url');
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
      return payload.exp > Date.now() ? payload : null;
    } catch {
      return null;
    }
  }

  private publicUser(u: any) {
    const { passwordHash, ...rest } = u;
    return rest;
  }

  async register(data: { name: string; email: string; password: string; phone?: string; companyName?: string }) {
    const email = (data.email || '').toLowerCase().trim();
    if (!data.name || !email || !data.password) throw new BadRequestException('Name, email and password are required');
    if (data.password.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('An account with this email already exists');
    const user = await this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email,
        phone: data.phone,
        companyName: data.companyName,
        passwordHash: this.hashPassword(data.password),
        role: 'CUSTOMER',
      },
    });
    return { token: this.signToken({ sub: user.id, role: user.role }), user: this.publicUser(user) };
  }

  async login(emailRaw: string, password: string, requireAdmin = false) {
    const email = (emailRaw || '').toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !this.verifyPassword(password || '', user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (requireAdmin && user.role !== 'ADMIN') throw new UnauthorizedException('This account is not an administrator');
    return { token: this.signToken({ sub: user.id, role: user.role }), user: this.publicUser(user) };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return this.publicUser(user);
  }

  async listCustomers() {
    const users = await this.prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { orders: true } } },
    });
    return users.map((u) => this.publicUser(u));
  }
}
