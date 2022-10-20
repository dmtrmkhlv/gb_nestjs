import { Comment } from './comment.dto';

export class News {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: Date;
  comments: Comment[];
}
