import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';

function attachUser(ctx: ExecutionContext, auth: AuthService) {
  const req = ctx.switchToHttp().getRequest();
  const header: string = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = auth.verifyToken(token);
  if (!payload) throw new UnauthorizedException('Please log in');
  req.user = payload;
  return payload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  canActivate(ctx: ExecutionContext) {
    attachUser(ctx, this.auth);
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService) {}
  canActivate(ctx: ExecutionContext) {
    const user = attachUser(ctx, this.auth);
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access only');
    return true;
  }
}
