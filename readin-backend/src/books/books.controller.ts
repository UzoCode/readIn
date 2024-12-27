import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { MetadataService } from './metadata.service'; // Import MetadataService
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private metadataService: MetadataService // Inject the MetadataService
  ) {}

  @Get()
  async getBooks() {
    return this.booksService.getBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    const book = await this.booksService.getBookById(+id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      ...book,
      fileUrl: `/uploads/${book.filePath}`,
    };
  }

  @Post('extract-metadata')
  @UseInterceptors(FileInterceptor('file'))
  async extractMetadata(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('No file uploaded');
    }
    const metadata = await this.metadataService.extractMetadata(file.buffer);
    return metadata;
  }
}
