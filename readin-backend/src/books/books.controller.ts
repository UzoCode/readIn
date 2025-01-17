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
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { MetadataService } from '../metadata/metadata.service'; // Import MetadataService
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; // Ensure proper import of Express types
import { diskStorage } from 'multer';
import pdf from 'pdf-parse';
import * as fs from 'fs';
import * as path from 'path';
import * as epubParser from 'epub-parser';

// Ensure the uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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
    const bookId = parseInt(id, 10); // Convert id to a number
    if (isNaN(bookId)) {
      throw new BadRequestException('Invalid book ID'); // Handle invalid ID case
    }
    const book = await this.booksService.getBookById(bookId); // Call the service method to get a book by ID
    if (!book) {
    throw new NotFoundException(`Book with ID ${bookId} not found`); // Handle not found case
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
@UseInterceptors(FileInterceptor('file', {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR); // Use the uploads directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
}))

async uploadBook(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: { content?: string; category?: string }
) {
  if (!file) {
    throw new NotFoundException('No file uploaded');
  }

  // Automatically extract metadata from the file
  const { title, author, genre } = await this.extractMetadataFromFile(file);

  // Call the service method to save the book details
  const savedBook = await this.booksService.saveBook({
    title: title || 'Untitled', // Default title if not extracted
    author: author || 'Unknown', // Default author if not extracted
    genre: genre || 'General', // Default genre if not extracted
    filePath: file.filename,
    content: body.content || '',
    category: body.category || '',
  });

  return { message: 'Book uploaded successfully!', book: savedBook };
}

  // Function to extract metadata from the uploaded file
  private async extractMetadataFromFile(file: Express.Multer.File) {
    const filePath = path.join(UPLOADS_DIR, file.filename); // Use the uploads directory

    // Check the file extension to determine how to parse it
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (fileExtension === '.pdf') {
      // Read the PDF file and extract metadata
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      return {
        title: data.info.Title || '',
        author: data.info.Author || '',
        genre: data.info.Subject || '',
      };
    } else if (fileExtension === '.epub') {
      // Read the EPUB file and extract metadata
      const epubData = await epubParser.parse(filePath);
      return {
        title: epubData.metadata.title || '',
        author: epubData.metadata.creator || '',
        genre: epubData.metadata.subject || '',
      };
    } else {
      throw new BadRequestException('Unsupported file type. Please upload a PDF or EPUB file.');
    }
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
