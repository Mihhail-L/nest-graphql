import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendConfirmationToken(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Please confirm your account',
      template: './confirmation',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        token,
      },
    });
  }

  async sendPasswordResetToken(user: User, token: string): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: './passwordReset',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        token,
      },
    });
  }
}
