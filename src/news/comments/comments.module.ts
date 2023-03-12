import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SocketCommentsGateway } from './socket-comments.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from 'src/users/users.entity';
import { NewsService } from '../news.service';
import { NewsEntity } from 'src/news/news.entity';
@Module({
  controllers: [CommentsController],
  providers: [
    CommentsService,
    SocketCommentsGateway,
    AuthService,
    UsersService,
    JwtService,
    NewsService,
  ],
  exports: [CommentsService],
  imports: [
    TypeOrmModule.forFeature([CommentsEntity, UsersEntity, NewsEntity]),
  ],
})
export class CommentsModule {}
