import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { BooksService } from '../books/books.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Book])],
  providers: [AuthorsResolver, AuthorsService, BooksService],
})
export class AuthorsModule {}
