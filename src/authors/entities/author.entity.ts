import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity()
@ObjectType()
export class Author {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  @Field(() => Int)
  id: number;

  @Column('varchar', { length: 255 })
  @Field(() => String)
  firstName: string;

  @Column('varchar', { length: 255 })
  @Field(() => String)
  lastName: string;

  @OneToMany(() => Book, (book) => book.author)
  @Field(() => [Book], { nullable: true })
  books?: Book[];
}
