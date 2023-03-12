import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';
import { CommentsEntity } from '../news/comments/comments.entity';
import { IsEnum } from 'class-validator';
import { Role } from 'src/auth/role/role.enum';
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('text')
  firstName: string;
  @Column('text')
  lastName: string;
  @Column('text')
  email: string;
  @Column('text')
  password: string;
  @Column('text')
  @IsEnum(Role)
  roles: Role;
  @OneToMany(() => NewsEntity, (news) => news.author)
  news: NewsEntity[];
  @OneToMany(() => CommentsEntity, (comments) => comments.author)
  comments: CommentsEntity[];
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
