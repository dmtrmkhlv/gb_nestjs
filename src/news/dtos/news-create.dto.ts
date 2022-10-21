import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsDateString,
} from 'class-validator';
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
  createdAt: string;

  comments: [];
}
