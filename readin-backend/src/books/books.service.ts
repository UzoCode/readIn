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
  readingProgress?: number; // Optional field for reading progress
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
        readingProgress: true, // Include reading progress in the selection
      },
    });

    return books.map(book => ({
      ...book,
      genre: book.genre ?? undefined,
      filePath: book.filePath ?? undefined,
      readingProgress: book.readingProgress ?? undefined, // Convert null to undefined
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
        readingProgress: true, // Include reading progress in the selection
      },
    });
  
    if (book) {
      return {
        ...book,
        filePath: book.filePath ? `/uploads/${book.filePath}` : undefined,
        genre: book.genre ?? undefined,
        readingProgress: book.readingProgress ?? undefined, // Convert null to undefined
      };
    }
  
    return null; // Return null if no book is found
  }

  /**
   * Save a new book to the database.
   * @param bookData - The data of the book to save.
   * @returns A promise that resolves to the created Book object.
   */
  async saveBook(bookData: { title: string; author: string; genre: string; filePath: string; content: string; category: string; readingProgress?: number | null }): Promise<Book> {
    const { title, author, genre, filePath, content, category, readingProgress = null } = bookData; // Default to null if not provided
  
    // Create a new book entry in the database
    const newBook = await this.prisma.book.create({
      data: {
        title,
        author,
        genre,
        filePath,
        content,
        category,
        readingProgress, // Include reading progress
      },
    });
  
    // Convert readingProgress to undefined if it's null
    return {
      ...newBook,
      readingProgress: newBook.readingProgress ?? undefined, // Convert null to undefined
    };
  }

  /**
   * Delete a book by its ID.
   * @param id - The ID of the book to delete.
   * @returns A promise that resolves to a boolean indicating success.
   */
  async deleteBook(id: number): Promise<boolean> {
    const deletedBook = await this.prisma.book.delete({
      where: { id },
    });
    return !!deletedBook; // Return true if a book was deleted
  }

  /**
   * Save reading progress for a book.
   * @param id - The ID of the book to update.
   * @param progress - The reading progress to save.
   * @returns A promise that resolves to the updated Book object or null if not found.
   */
  async saveReadingProgress(id: number, progress: number): Promise<Book | null> {
    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: { readingProgress: progress }, // Update the reading progress
    });
  
    // Convert readingProgress to undefined if it's null
    return {
      ...updatedBook,
      readingProgress: updatedBook.readingProgress ?? undefined, // Convert null to undefined
    };
  }
}
