import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../dto/update-user.input';
import { ValidateUserInput } from './valiateUserInput';
import { createUserPasswordHash } from './userPasswordHelpers';

const updateUserObject = async (
  user: User,
  input: UpdateUserInput,
): Promise<User> => {
  const validateUserInput = new ValidateUserInput();
  if (input.firstName && input.firstName !== user.firstName) {
    user.firstName = input.firstName;
  }

  if (input.lastName && input.lastName !== user.lastName) {
    user.lastName = input.lastName;
  }

  if (input.email && input.email !== user.email) {
    validateUserInput.validateUserEmail(input.email);
    user.email = input.email;
  }

  if (input.password) {
    validateUserInput.validateUserPassword(input.password);
    user.password = await createUserPasswordHash(input.password);
  }

  if (input.roles) {
    user.roles = input.roles;
  }

  if (input.status && input.status !== user.status) {
    user.status = input.status;
  }

  return user;
};

export default updateUserObject;
