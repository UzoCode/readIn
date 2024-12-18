// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule],  // Add PrismaModule to imports
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
