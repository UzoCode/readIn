import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// User methods
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
