import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoints for login and sign 
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ message: string; user: { id: number; username: string; email: string } }> {
    return this.authService.signup(signupDto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(requestPasswordResetDto);
  }
}
