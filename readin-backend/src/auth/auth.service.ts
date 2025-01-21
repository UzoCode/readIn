import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as crypto from 'crypto'; // For generating a reset token
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service'; // Assuming you have a mail service for sending emails


@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly mailService: MailService) {}


  async signup(signupDto: SignupDto): Promise<{ message: string; user: { id: number; username: string; email: string } }> {
    const { username, email, password } = signupDto;

    // Check if the user already exists
    const existingUser  = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser ) {
      throw new ConflictException('Email already exists'); // Throw an error if the email is already in use
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return {
      message: 'User  created successfully',
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async login(loginDto: LoginDto): Promise<{ token: string; user: { id: number; username: string; email: string } }> {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    // Compare the password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    };
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto): Promise<{ message: string }> {
    const { email } = requestPasswordResetDto;
  
    // Ensure email is defined
    if (!email) {
      throw new Error('Email is required');
    }
  
    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email: email! } });
    if (!user) {
      throw new UnauthorizedException('User  not found');
    }
  
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    // Update the user with the reset token and expiry
    await this.prisma.user.update({
      where: { email: email! }, // Ensure email is defined
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) }, // Token valid for 1 hour
    });
  
    // Send the reset token to the user's email
    await this.mailService.sendPasswordResetEmail(email, resetToken);
  
    return { message: 'Password reset email sent' };
  }


  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    // Ensure newPassword is defined
    if (!newPassword) {
        throw new Error('New password is required');
    }

    // Find the user by the reset token
    const user = await this.prisma.user.findFirst({ where: { resetToken: token } });
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
        throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
    return { message: 'Password has been reset successfully' };
  }
}
