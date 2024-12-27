import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Define the Book interface
export interface Book {
  id: number;
  title: string;
  author: string;
  content: string;
  category: string;
  genre?: string; // Mark genre as optional
  filePath?: string; // Optional if it may not always be present
}

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks(): Promise<Book[]> {
    // Explicitly select all fields, including optional ones
    return this.prisma.book.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        content: true,
        category: true,
        genre: true,
        filePath: true,
      },
    });
  }


  async getBookById(id: number): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        author: true,
        content: true,
        category: true,
        genre: true, // Ensure genre is included
        filePath: true, // Ensure filePath is included
      },
    });

    // Return the book with the file URL if it exists
    if (book) {
      return {
        ...book,
        filePath: book.filePath ? `/uploads/${book.filePath}` : undefined, // Construct the file URL if filePath exists
      };
    }

    return null; // Return null if no book is found
  }
}
