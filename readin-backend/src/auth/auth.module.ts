import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service'; // Import path as necessary could adjusted 


@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailService],
})
export class AuthModule {}
