import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { MetadataService } from '../metadata/metadata.service'; // Import MetadataService
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Ensure proper import of Express types

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService, // Use readonly for dependency injection
    private readonly metadataService: MetadataService, // Inject MetadataService
  ) {}

  // Endpoint to retrieve all books
  @Get()
  async getBooks() {
    return this.booksService.getBooks(); // Call the service method to get all books
  }

  // Endpoint to retrieve a book by its ID
  @Get(':id')
  async getBookById(@Param('id') id: string) {
    const book = await this.booksService.getBookById(+id); // Call the service method to get a book by ID
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`); // Handle not found case
    }
    return {
      ...book,
      fileUrl: `/uploads/${book.filePath}`, // Construct the file URL
    };
  }

  // Endpoint to extract metadata from an uploaded file
  @Post('extract-metadata')
  @UseInterceptors(FileInterceptor('file')) // Use Multer to handle file uploads
  async extractMetadata(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file uploaded'); // Handle no file uploaded case
    }
    const metadata = await this.metadataService.extractMetadata(file.buffer); // Extract metadata from the file
    return metadata; // Return the extracted metadata
  }

  // Endpoint to upload a book
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // Use Multer to handle file uploads
  async uploadBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; author: string; genre: string; content?: string; category?: string }
  ) {
    if (!file) {
      throw new NotFoundException('No file uploaded'); // Handle no file uploaded case
    }
    const { title, author, genre, content = '', category = '' } = body; // Destructure the request body

    // Call the service method to save the book details
    await this.booksService.saveBook({
      title,
      author,
      genre,
      filePath: file.filename, // Assuming you handle file storage and filename generation
      content,
      category,
    });

    return { message: 'Book uploaded successfully!', file }; // Return success message
  }

  // Endpoint to delete a book by its ID
  @Delete(':id')
  async deleteBook(@Param('id') id: string) {
    const deleted = await this.booksService.deleteBook(+id); // Call the service method to delete a book
    if (!deleted) {
      throw new NotFoundException(`Book with ID ${id} not found`); // Handle not found case
    }
    return { message: `Book with ID ${id} deleted successfully.` }; // Return success message
  }

  // Endpoint to save reading progress
  @Patch(':id/progress')
  async saveReadingProgress(
    @Param('id') id: string,
    @Body() body: { progress: number } // Assuming progress is a number representing the current page or position
  ) {
    const updatedBook = await this.booksService.saveReadingProgress(+id, body.progress); // Call the service method to save reading progress
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`); // Handle not found case
    }
    return { message: `Reading progress for book ID ${id} saved successfully.`, updatedBook }; // Return success message
  }
}
