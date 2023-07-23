import { CreateUserInput } from '../dto/create-user.input';
import { User } from '../entities/user.entity';
import { createUserPasswordHash } from './userPasswordHelpers';
import { ValidateUserInput } from './valiateUserInput';
import { Roles } from '../../common/graphql/enums/userEnums';

const createUserObject = async ({
  firstName,
  lastName,
  email,
  password,
  status,
  roles,
}: CreateUserInput): Promise<User> => {
  const validateUserInput = new ValidateUserInput();
  validateUserInput.validateUserEmail(email);
  validateUserInput.validateUserPassword(password);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = await createUserPasswordHash(password);
  user.roles = [Roles.REGISTERED];

  if (status) {
    user.status = status;
  }

  if (roles) {
    user.roles = roles;
  }

  return user;
};

export default createUserObject;
