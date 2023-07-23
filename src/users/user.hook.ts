import { User } from './entities/user.entity';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { UsersService } from './users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserHook implements SubjectBeforeFilterHook<User, Request> {
  constructor(private readonly usersService: UsersService) {}

  async run(req: Request): Promise<User> {
    const userId = req.params.input.id ? req.params.input.id : req.user.id;

    return await this.usersService.findOne(userId, true);
  }
}
