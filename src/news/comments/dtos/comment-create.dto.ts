import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  newsId: number;

  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @ValidateIf((o) => o.cover)
  @IsString()
  cover: string;
}
