import { UserInputError } from '@nestjs/apollo';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

const validateUniqueUser = async (
  email: string,
  userRepository: Repository<User>,
): Promise<void> => {
  const user = await userRepository.findOne({ where: { email } });
  if (user) {
    throw new UserInputError('Email address is already in use.');
  }
};

export default validateUniqueUser;
