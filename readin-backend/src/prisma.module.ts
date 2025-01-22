import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Register PrismaService as a provider
  exports: [PrismaService],   // Export PrismaService for other modules
})
export class PrismaModule {}
