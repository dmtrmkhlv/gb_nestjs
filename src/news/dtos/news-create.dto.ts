import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { Comment } from 'src/dto/comment.dto';
export class NewsCreateDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateIf((o) => o.author)
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  comments: Comment[];

  @ValidateIf((o) => o.cover)
  @IsString()
  cover: string;
}
