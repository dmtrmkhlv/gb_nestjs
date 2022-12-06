import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersEntity } from 'src/users/users.entity';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    CommentsModule,
    MailModule,
    TypeOrmModule.forFeature([NewsEntity, UsersEntity]),
  ],
})
export class NewsModule {}
