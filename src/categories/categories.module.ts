import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesEntity } from './categories.entity';
import { CategoriesService } from './categories.service';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([CategoriesEntity])],
})
export class CategoriesModule {}
