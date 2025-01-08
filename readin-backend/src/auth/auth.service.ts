import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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
}
