import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as crypto from 'crypto'; // For generating a reset token
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { newPassword } = resetPasswordDto;

    // Ensure newPassword is defined
    if (!newPassword) {
        throw new Error('New password is required');
    }

    // Find the user by email (you may want to pass email in the DTO)
    const user = await this.prisma.user.findUnique({ where: { email: resetPasswordDto.email } });
    if (!user) {
        throw new UnauthorizedException('User  not found');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });
    return { message: 'Password has been reset successfully' };
  }
}