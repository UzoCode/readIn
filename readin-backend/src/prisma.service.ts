import { Injectable } from '@nestjs/common';
import { PrismaClient, Book as PrismaBook } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  /**
   * Create a new book in the database.
   * @param data - The book data to be created.
   * @returns The created book.
   */
  async createBook(data: PrismaBook): Promise<PrismaBook> {
    return this.book.create({
      data,
    });
  }

  /**
   * Retrieve all books from the database.
   * @returns An array of books.
   */
  async getAllBooks(): Promise<PrismaBook[]> {
    return this.book.findMany();
  }

  /**
   * Retrieve a book by its ID.
   * @param id - The ID of the book to retrieve.
   * @returns The book if found, or null.
   */
  async getBookById(id: number): Promise<PrismaBook | null> {
    return this.book.findUnique({
      where: { id },
    });
  }

  /**
   * Update a book's metadata in the database.
   * @param id - The ID of the book to update.
   * @param data - The new data for the book.
   * @returns The updated book.
   */
  async updateBook(id: number, data: Partial<PrismaBook>): Promise<PrismaBook> {
    return this.book.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a book from the database.
   * @param id - The ID of the book to delete.
   * @returns The deleted book.
   */
  async deleteBook(id: number): Promise<PrismaBook> {
    return this.book.delete({
      where: { id },
    });
  }
}