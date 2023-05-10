import { Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Author } from '../authors/entities/author.entity';
import { GraphQLError } from 'graphql/error';
import { GetBookInput } from './dto/get-book.input';

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
        throw new GraphQLError('Author not found');
      }
    }

    return this.bookRepository.save(finalBookInput);
  }

  findAll(input?: GetBookInput): Promise<Book[]> {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author');

    if (input?.author) {
      queryBuilder.where('author.id in (:...author)', {
        author: input.author,
      });
    }

    if (input?.id) {
      queryBuilder.whereInIds(input.id);
    }

    return queryBuilder.getMany();
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
  }

  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    const book = await this.findOne(id);

    if (!book) {
      throw new GraphQLError('Book not found');
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
        throw new GraphQLError('Author not found');
      }
    }

    return this.bookRepository.save(book);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.bookRepository.delete(id);
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
