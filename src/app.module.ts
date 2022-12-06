import { NewsService } from './news/news.service';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { NewsModule } from './news/news.module';
import { NewsController } from './news/news.controller';
import { CalculateController } from './calculate/calculate.controller';
import { CalculateService } from './calculate/calculate.service';
import { MailModule } from './mail/mail.module';
import { CommentsModule } from './news/comments/comments.module';
import { UsersModule } from './users/users.module';
import { CategoriesService } from './categories/categories.service';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from './users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [UsersEntity],
      synchronize: true,
    }),
    // NewsModule,
    CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailModule,
    UsersModule,
    CategoriesModule,
  ],
  // controllers: [
  //   AppController,
  //   CalculateController,
  //   NewsController,
  //   CategoriesController,
  // ],
  controllers: [AppController],
  // providers: [AppService, CalculateService, NewsService, CategoriesService],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(NewsController);
    // .forRoutes('news');
    // .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
