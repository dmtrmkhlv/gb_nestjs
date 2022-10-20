import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  private readonly comments = {};
  async create(idNews: string, comment: string): Promise<number> {
    if (!this.comments?.[idNews]) {
      this.comments[idNews] = [];
    }
    return this.comments[idNews].push({
      comment,
      id: uuidv4(),
    });
  }
  async findAll(idNews: string): Promise<{ comment; id } | undefined> {
    return this.comments?.[idNews];
  }
  async remove(idNews: string, idComment: string): Promise<boolean> {
    const index = this.comments?.[idNews].findIndex((x) => x.id === idComment);
    if (index !== -1) {
      this.comments[idNews].splice(index, 1);
      return true;
    }
    return false;
  }
  async removeAll(idNews: string): Promise<boolean> {
    return delete this.comments?.[idNews];
  }
}
