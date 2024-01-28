import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class DatabaseConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('db_host'),
      port: +this.configService.get<number>('db_port'),
      username: this.configService.get<string>('db_user'),
      password: this.configService.get<string>('db_password'),
      database: this.configService.get<string>('db_name'),
      entities: [__dirname + '/../**/*.entity.js',],
      migrations: ['./database/migrations/*.ts'],
      synchronize: true,
    };
  }
}