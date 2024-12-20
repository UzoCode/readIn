import { Controller, Get } from '@nestjs/common';
      import { BooksService } from './books.service';

      @Controller('books')
      export class BooksController {
        constructor(private booksService: BooksService) {}

        @Get()
        getBooks() {
          return this.booksService.getBooks();
        }
      }