import { Injectable } from '@nestjs/common';
      import { PrismaService } from '../prisma.service';

      @Injectable()
      export class BooksService {
        constructor(private prisma: PrismaService) {}

        async getBooks() {
          return this.prisma.book.findMany();
        }
      }