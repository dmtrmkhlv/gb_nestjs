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
  id: number;
  title: string;
  description: string;
  author: UsersEntity;
  cover?: string;
  createdAt: Date;
  updatedAt?: Date;
  comments?: Comment[];
  authorId?: number;
  categoryId?: number;
}
