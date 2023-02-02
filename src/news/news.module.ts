import { UsersService } from 'src/users/users.service';
import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersEntity } from 'src/users/users.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesEntity } from 'src/categories/categories.entity';

@Module({
  controllers: [NewsController],
  providers: [NewsService, UsersService, CategoriesService],
  imports: [
    CommentsModule,
    MailModule,
    TypeOrmModule.forFeature([NewsEntity, UsersEntity, CategoriesEntity]),
  ],
})
export class NewsModule {}
