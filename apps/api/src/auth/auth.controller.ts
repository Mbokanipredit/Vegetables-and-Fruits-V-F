import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, AdminGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.auth.login(body.email, body.password);
  }

  @Post('admin/login')
  adminLogin(@Body() body: any) {
    return this.auth.login(body.email, body.password, true);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: any) {
    return this.auth.me(req.user.sub);
  }

  @Get('customers')
  @UseGuards(AdminGuard)
  customers() {
    return this.auth.listCustomers();
  }
}
