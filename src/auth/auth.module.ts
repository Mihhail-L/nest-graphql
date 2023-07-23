import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfirmationToken } from '../common/entities/userConfirmationToken.entity';
import { PasswordResetToken } from '../common/entities/passwordResetToken.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET, JWT_TTL } from '../common/util/envConfig';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MailModule,
    UsersModule,
    TypeOrmModule.forFeature([UserConfirmationToken, PasswordResetToken]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_TTL },
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
