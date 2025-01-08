import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Define the Book interface
export interface Book {
  id: number;
  title: string;
  author: string;
  content: string; // Required field
  category: string; // Required field
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

    return books.map(book => ({
      ...book,
      genre: book.genre ?? undefined,
      filePath: book.filePath ?? undefined,
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
        genre: true,
        filePath: true,
      },
    });

    if (book) {
      return {
        ...book,
        filePath: book.filePath ? `/uploads/${book.filePath}` : undefined,
        genre: book.genre ?? undefined,
      };
    }

    return null; // Return null if no book is found
  }

  /**
   * Save a new book to the database.
   * @param bookData - The data of the book to save.
   * @returns A promise that resolves to the created Book object.
   */
  async saveBook(bookData: { title: string; author: string; genre: string; filePath: string; content: string; category: string }): Promise<Book> {
    const { title, author, genre, filePath, content, category } = bookData;

    // Create a new book entry in the database
    const newBook = await this.prisma.book.create({
      data: {
        title,
        author,
        genre,
        filePath,
        content,
        category,
      },
    });

    return newBook;
  }
}