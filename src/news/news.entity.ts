import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { CategoriesEntity } from '../categories/categories.entity';
import { UsersEntity } from '../users/users.entity';
@Entity('news')
export class NewsEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column('text')
  title: string;
  @Column('text')
  description: string;
  @Column('text', { nullable: true })
  cover: string;
  @ManyToOne(() => CategoriesEntity, (category) => category.news)
  category: CategoriesEntity;
  @ManyToOne(() => UsersEntity, (user) => user.news)
  author: UsersEntity;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date | undefined;
}
