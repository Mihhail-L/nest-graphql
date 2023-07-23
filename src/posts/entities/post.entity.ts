import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class PostEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Field(() => String)
  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Field(() => String)
  @Column('text', { name: 'content' })
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  author: User;

  @Field(() => Date)
  @Column('datetime', { name: 'createdAt', default: () => 'NOW' })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column('datetime', { name: 'updatedAt', nullable: true, default: null })
  updatedAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('datetime', { name: 'deletedAt', nullable: true, default: null })
  deletedAt: Date | null;
}
