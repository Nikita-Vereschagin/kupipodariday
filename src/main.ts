import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(PORT);
}
bootstrap();
