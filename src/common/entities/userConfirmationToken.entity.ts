import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as crypto from 'crypto';

@Entity()
export class UserConfirmationToken {
  constructor() {
    this.token = crypto.randomBytes(12).toString('hex');
    this.createdAt = new Date();
  }

  @Column('int', { primary: true, name: 'id', generated: true })
  id: number;

  @Column('varchar', { name: 'token', unique: true, length: 255 })
  token: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column('datetime', { name: 'createdAt', default: () => 'NOW' })
  createdAt: Date;
}
