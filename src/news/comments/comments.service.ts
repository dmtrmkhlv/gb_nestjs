// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Comment } from 'src/dto/comment.dto';
// import { Repository } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
// import { CommentsEntity } from './comments.entity';
// import { CommentCreateDto } from './dtos/comment-create.dto';
// import { CommentUpdateDto } from './dtos/comment-update.dto';

// @Injectable()
// export class CommentsService {
//   constructor(
//     @InjectRepository(CommentsEntity)
//     private readonly commentsRepository: Repository<CommentsEntity>,
//   ) {}
//   private readonly comments = {
//     qwe: [
//       {
//         id: '1',
//         text: 'text',
//       },
//       {
//         id: '2',
//         text: 'text second',
//       },
//     ],
//   };
//   async create(idNews: string, comment: CommentCreateDto) {
//     if (!this.comments?.[idNews]) {
//       this.comments[idNews] = [];
//     }

//     return await this.commentsRepository.save({
//       newsId: idNews,
//       text: comment.text,
//       cover: comment.cover,
//       id: uuidv4(),
//     });
//   }

//   async findAll(idNews: string): Promise<CommentCreateDto[] | undefined> {
//     return this.comments?.[idNews];
//   }
//   async updateComments(
//     idNews: string,
//     comment: Comment,
//   ): Promise<{} | boolean> {
//     const news = await this.commentsRepository.findOneById(idNews);
//     const index = news['comments'].findIndex(
//       (x: Comment) => x.id == comment.id,
//     );

//     if (index !== -1) {
//       news['comments'][index].text = comment.text;
//       await this.commentsRepository.update(index, news['comments']);
//     }
//     return false;
//   }

//   async remove(idNews: string, idComment: string): Promise<boolean> {
//     const news = await this.commentsRepository.findOneById(idNews);
//     const index = news['comments'].findIndex((x) => x.id === idComment);
//     if (index !== -1) {
//       await this.commentsRepository.delete(index);
//       return true;
//     }
//     return false;
//   }

//   async removeAll(idNews: string): Promise<boolean> {
//     return delete this.comments?.[idNews];
//   }
// }

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CommentsEntity } from './comments.entity';
import { UsersService } from 'src/users/users.service';
import { NewsService } from '../news.service';
import { CommentUpdateDto } from './dto/comment-update.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly userService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  private readonly comments = {
    qwe: [
      {
        id: '1',
        text: 'text',
      },
      {
        id: '2',
        text: 'text second',
      },
    ],
  };
  async create(
    idNews: string,
    message: string,
    userId: string,
  ): Promise<CommentsEntity | HttpException> {
    const _news = await this.newsService.findNews(idNews);
    const _user = await this.userService.findById(userId);
    if (!_news || !_user) {
      throw new HttpException(
        'Не существует такой новости',
        HttpStatus.BAD_REQUEST,
      );
    }
    const _commentEntity = new CommentsEntity();
    _commentEntity.news = _news;
    _commentEntity.text = message;
    _commentEntity.author = _user;
    return await this.commentsRepository.save(_commentEntity);
  }
  async findAll(idNews): Promise<CommentsEntity[] | undefined> {
    return await this.commentsRepository.find({
      where: { news: idNews },
      relations: ['user'],
    });
  }
  async findById(id): Promise<any> {
    return await this.commentsRepository.findOne({
      where: { id: id },
      relations: ['news'],
    });
  }
  async remove(id: string) {
    const _comment = await this.findById(id);
    this.eventEmitter.emit('comment.remove', {
      commentId: _comment.id,
      newsId: _comment.news.id,
    });
    return await this.commentsRepository.remove(_comment);
  }
  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }

  async updateComments(
    id: string,
    comment: CommentUpdateDto,
  ): Promise<CommentsEntity[] | boolean> {
    const oldComment = await this.findById(id);
    if (oldComment) {
      return await this.commentsRepository.save({ ...oldComment, ...comment });
    }

    return false;
  }
}
