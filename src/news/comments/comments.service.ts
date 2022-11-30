import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/dto/comment.dto';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CommentsEntity } from './comments.entity';
import { CommentCreateDto } from './dtos/comment-create.dto';
import { CommentUpdateDto } from './dtos/comment-update.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
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
  async create(idNews: string, comment: CommentCreateDto) {
    if (!this.comments?.[idNews]) {
      this.comments[idNews] = [];
    }

    return await this.commentsRepository.save({
      newsId: idNews,
      text: comment.text,
      cover: comment.cover,
      id: uuidv4(),
    });
  }

  async findAll(idNews: number): Promise<CommentCreateDto[] | undefined> {
    return this.comments?.[idNews];
  }
  async updateComments(
    idNews: number,
    comment: Comment,
  ): Promise<{} | boolean> {
    const news = await this.commentsRepository.findOneById(idNews);
    const index = news['comments'].findIndex(
      (x: Comment) => x.id == comment.id,
    );

    if (index !== -1) {
      news['comments'][index].text = comment.text;
      await this.commentsRepository.update(index, news['comments']);
    }
    return false;
  }

  async remove(idNews: number, idComment: number): Promise<boolean> {
    const news = await this.commentsRepository.findOneById(idNews);
    const index = news['comments'].findIndex((x) => x.id === idComment);
    if (index !== -1) {
      await this.commentsRepository.delete(index);
      return true;
    }
    return false;
  }

  async removeAll(idNews: number): Promise<boolean> {
    return delete this.comments?.[idNews];
  }
}
