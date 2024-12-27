import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Define the Book interface
export interface Book {
  id: number;
  title: string;
  author: string;
  content: string;
  category: string;
  genre: string | null | undefined; // Allow both null and undefined
  filePath: string | null | undefined; // Same adjustment for filePath
}


@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieve all books from the database.
   * @returns A promise that resolves to an array of Book objects.
   */
  async getBooks(): Promise<Book[]> {
    // Explicitly select all fields, including optional ones
    const books = await this.prisma.book.findMany({
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

    // Map the results to ensure genre and filePath are properly typed
    return books.map(book => ({
      ...book,
      genre: book.genre ?? undefined, // Convert null to undefined
      filePath: book.filePath ?? undefined, // Convert null to undefined
    }));
  }

  /**
   * Retrieve a book by its ID.
   * @param id - The ID of the book to retrieve.
   * @returns A promise that resolves to a Book object or null if not found.
   */
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
        genre: book.genre ?? undefined, // Convert null to undefined
      };
    }

    return null; // Return null if no book is found
  }
}