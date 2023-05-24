import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Author } from '../authors/entities/author.entity';
import { GetBookInput } from './dto/get-book.input';
import { DeleteResult } from '../common/graphql/commonTypes/deleteResult';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  async create(createBookInput: CreateBookInput): Promise<Book> {
    const { description, title, author } = createBookInput;
    const finalBookInput: Partial<Book> = {
      description,
      title,
    };
    if (author) {
      try {
        finalBookInput.author = await this.authorRepository.findOneBy({
          id: author,
        });
      } catch (error) {
        throw new NotFoundException(`Author not found ${author}`);
      }
    }

    return this.bookRepository.save(finalBookInput);
  }

  async findAll(input?: GetBookInput): Promise<Book[]> {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    if (input?.id) {
      queryBuilder.whereInIds(input.id);
    }

    if (input?.author) {
      queryBuilder.where('author.id in (:...author)', {
        author: input.author,
      });
    }

    const books = await queryBuilder.getMany();

    if (!books.length && input?.id) {
      throw new NotFoundException(`No book found for ${input.id}`);
    }

    return books;
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async update(updateBookInput: UpdateBookInput): Promise<Book> {
    const book = await this.findOne(updateBookInput.id);

    if (!book) {
      throw new NotFoundException(`Book not found ${updateBookInput.id}`);
    }

    const { description, title, author } = updateBookInput;

    if (book.description !== description) {
      book.description = description;
    }

    if (book.title !== title) {
      book.title = title;
    }

    if (author) {
      try {
        book.author = await this.authorRepository.findOneBy({
          id: author,
        });
      } catch (error) {
        throw new NotFoundException(`Author not found ${author}`);
      }
    }

    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<DeleteResult> {
    const book = await this.findOne(id);

    if (!book) {
      throw new NotFoundException(`Book not found ${id}`);
    }
    const deleteResult = await this.bookRepository.delete(id);

    return {
      deletedCount: deleteResult.affected,
      acknowledged: deleteResult.affected > 0,
    };
  }

  findAllByAuthor(authorId: number): Promise<Book[]> {
    return this.bookRepository.find({
      where: {
        author: {
          id: authorId,
        },
      },
    });
  }
}
