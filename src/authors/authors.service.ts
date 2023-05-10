import { Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GetAuthorInput } from './dto/get-author.input';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  create(createAuthorInput: CreateAuthorInput): Promise<Author> {
    return this.authorRepository.save(createAuthorInput);
  }

  findAll(input: GetAuthorInput): Promise<Author[]> {
    const query = this.authorRepository.createQueryBuilder('author');
    if (input?.id) {
      query.whereInIds(input.id);
    }
    if (input?.book) {
      query
        .leftJoinAndSelect('author.books', 'book')
        .where('book.id IN (:...bookIds)', { bookIds: input.book });
    }
    return query.getMany();
  }

  findOne(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id },
    });
  }

  update(
    id: number,
    updateAuthorInput: UpdateAuthorInput,
  ): Promise<UpdateResult> {
    return this.authorRepository.update({ id }, updateAuthorInput);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.authorRepository.delete({ id });
  }
}
