import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { NewsModule } from './news/news.module';
import { NewsController } from './news/news.controller';
import { MailModule } from './mail/mail.module';
import { CommentsModule } from './news/comments/comments.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from './users/users.entity';
import { NewsEntity } from './news/news.entity';
import { CommentsEntity } from './news/comments/comments.entity';
import { CategoriesEntity } from './categories/categories.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { UsersService } from './users/users.service';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [UsersEntity, NewsEntity, CommentsEntity, CategoriesEntity],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    NewsModule,
    CommentsModule,
    MailModule,
    UsersModule,
    CategoriesModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(NewsController);
    // .forRoutes('news');
    // .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
