import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository, UpdateResult } from 'typeorm';
import { GetAuthorInput } from './dto/get-author.input';
import { DeleteResult } from '../common/graphql/commonTypes/deleteResult';
import { last } from 'rxjs';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorRepository.save(createAuthorInput);
  }

  async findAll(input?: GetAuthorInput): Promise<Author[]> {
    const query = this.authorRepository
      .createQueryBuilder('author')
      .leftJoinAndSelect('author.books', 'book');

    if (input?.id) {
      query.whereInIds(input.id);
    }
    if (input?.book) {
      query.where('book.id IN (:...bookIds)', { bookIds: input.book });
    }
    const authors = await query.getMany();

    if (!authors.length && input) {
      throw new NotFoundException(
        `No authors found for input ${JSON.stringify(input)}`,
      );
    }

    return authors;
  }

  findOne(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id },
    });
  }

  update({
    id,
    firstName,
    lastName,
  }: UpdateAuthorInput): Promise<UpdateResult> {
    return this.authorRepository.update({ id }, { firstName, lastName });
  }

  async remove(id: number): Promise<DeleteResult> {
    const author = await this.findOne(id);

    if (!author) {
      throw new NotFoundException(`No author found for ${id}`);
    }

    const deleteResult = await this.authorRepository.delete({ id });

    return {
      acknowledged: deleteResult.affected > 0,
      deletedCount: deleteResult.affected,
    } as DeleteResult;
  }
}
