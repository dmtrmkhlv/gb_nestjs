import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Comment } from 'src/dto/comment.dto';

import { CommentsService } from './comments.service';

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getAll(@Query('idNews') idNews): Promise<{}> {
    return this.commentsService.findAll(idNews);
  }

  @Post('update')
  updateComments(
    @Query('idNews') idNews,
    @Body() comment: Comment,
  ): Promise<{} | boolean> {
    return this.commentsService.updateComments(idNews, comment);
  }

  @Post()
  create(@Query('idNews') idNews, @Body() comment): Promise<number> {
    return this.commentsService.create(idNews, comment);
  }

  @Delete(':id')
  remove(@Query('idNews') idNews, @Param('id') idComment): Promise<boolean> {
    return this.commentsService.remove(idNews, idComment);
  }

  @Delete('all')
  removeAll(@Query('idNews') idNews): Promise<boolean> {
    return this.commentsService.removeAll(idNews);
  }
}
