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

@Module({
  imports: [
    NewsModule,
    CommentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailModule,
  ],
  controllers: [AppController, CalculateController, NewsController],
  providers: [AppService, CalculateService, NewsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(NewsController);
    // .forRoutes('news');
    // .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
