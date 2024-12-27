import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Book } from './books/books.service'; // Import the Book interface
import { PDFDocument } from 'pdf-lib'; // Library for PDF manipulation
import { parseBuffer } from 'epub-parser'; // Use epub-parser for reading EPUB files

@Injectable()
export class MetadataService {
  constructor(private prisma: PrismaService) {}

  /**
   * Extract metadata from a PDF file.
   * @param fileBuffer - The buffer of the PDF file.
   * @returns An object containing the extracted metadata.
   */
  async extractPdfMetadata(fileBuffer: Buffer): Promise<Partial<Book>> {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const title = pdfDoc.getTitle() || undefined;
    const author = pdfDoc.getAuthor() || undefined;

    return {
      title,
      author,
      content: '', // Placeholder for content
      category: '', // Placeholder for category
      genre: undefined, // Optional, can be undefined
      filePath: undefined, // Optional, can be undefined
    };
  }

  /**
   * Extract metadata from an EPUB file.
   * @param fileBuffer - The buffer of the EPUB file.
   * @returns An object containing the extracted metadata.
   */
  async extractEpubMetadata(fileBuffer: Buffer): Promise<Partial<Book>> {
    return new Promise((resolve, reject) => {
      parseBuffer(fileBuffer, (err, metadata) => {
        if (err) {
          return reject(err);
        }

        const title = metadata.title || undefined;
        const author = metadata.creator || undefined;

        resolve({
          title,
          author,
          content: '', // Placeholder for content
          category: '', // Placeholder for category
          genre: metadata.language || undefined, // Assuming language is used for genre
          filePath: undefined, // Set to undefined or appropriate value
        });
      });
    });
  }

  /**
   * Update the metadata of a book in the database.
   * @param id - The ID of the book to update.
   * @param metadata - The metadata to update.
   * @returns The updated book.
   */
  async updateBookMetadata(id: number, metadata: Partial<Book>): Promise<Book | null> {
    return this.prisma.book.update({
      where: { id },
      data: {
        ...metadata,
        genre: metadata.genre === undefined ? null : metadata.genre, // Explicitly handle undefined to null conversion
      },
    });
  }  

  /**
   * Retrieve the metadata of a book by ID.
   * @param id - The ID of the book to retrieve.
   * @returns The book's metadata.
   */
  async getBookMetadata(id: number): Promise<Book | null> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        author: true,
        genre: true,
        filePath: true,
        content: true, // Ensure content is selected
        category: true, // Ensure category is selected
      },
    });

    if (book) {
      // Transform null values to undefined for compatibility with the Book interface
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        content: book.content, // Ensure content is provided
        category: book.category, // Ensure category is provided
        genre: book.genre ?? undefined, // Convert null to undefined
        filePath: book.filePath ?? undefined, // Convert null to undefined
      };
    }

    return null; // Return null if no book is found
  }
}
