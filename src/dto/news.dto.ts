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
  author: string;
  cover?: string;
  createdAt: Date;
  comments: Comment[];
}
