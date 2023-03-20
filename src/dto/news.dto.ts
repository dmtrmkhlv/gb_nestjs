import { CommentCreateDto } from 'src/news/comments/dto/comment-create.dto';
import { UsersEntity } from 'src/users/users.entity';
import { Comment } from './comment.dto';

// export class News {
//   id: string;
//   title: string;
//   description: string;
//   author: string;
//   createdAt: Date;
//   comments: Comment[];
// }

export interface News {
  id: string;
  title: string;
  description: string;
  author: UsersEntity;
  cover?: string;
  createdAt: Date;
  updatedAt?: Date;
  comments?: CommentCreateDto[];
  authorId?: string;
  categoryId?: string;
}
