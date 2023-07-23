import { UserInputError } from '@nestjs/apollo';

export class ValidateUserInput {
  validateUserEmail(email: string): void {
    const emailRegex = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]+$/);
    if (!emailRegex.test(email)) {
      throw new UserInputError('Invalid email address.');
    }
  }

  validateUserPassword(password: string): void {
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})/);
    if (!passwordRegex.test(password)) {
      throw new UserInputError(
        'Password must be at least 8 characters long, and contain at least one lowercase letter, one uppercase letter',
      );
    }
  }
}
