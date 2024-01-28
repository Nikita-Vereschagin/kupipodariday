import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/strategy/local.strategy';
import { JwtFactory } from 'src/config/jwt.factory';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
