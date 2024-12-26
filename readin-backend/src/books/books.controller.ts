import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  async getBooks() {
    // Fetch and return all books with relevant details
    return this.booksService.getBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    // Fetch a single book by its ID
    const book = await this.booksService.getBookById(+id); // Convert `id` to number
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      ...book,
      fileUrl: `/uploads/${book.filePath}`, // Construct the file URL if filePath exists
    };
  }
}
