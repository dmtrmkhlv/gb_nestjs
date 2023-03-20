import { News } from 'src/dto/news.dto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';
@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  text: string;

  @Column('text')
  news: NewsEntity;

  @ManyToOne(() => UsersEntity, (author) => author.comments)
  author: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
