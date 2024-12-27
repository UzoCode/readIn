// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from '../prisma.module'; // Import PrismaModule
import { MetadataModule } from '../metadata/metadata.module'; // Import MetadataModule

@Module({
  imports: [PrismaModule, MetadataModule], // Add MetadataModule to imports
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
