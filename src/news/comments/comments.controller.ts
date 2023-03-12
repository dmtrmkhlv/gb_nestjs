import { FilesInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Comment } from 'src/dto/comment.dto';

import { CommentsService } from './comments.service';
import { CommentUpdateDto } from './dto/comment-update.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utility/HelperFileLoader';
import { CommentCreateDto } from './dto/comment-create.dto';
import { CommentsEntity } from './comments.entity';

const PATH_NEWS = '/comment-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  getAll(@Param('id') id: string): Promise<CommentsEntity[]> {
    return this.commentsService.findAll(+id);
  }

  @Post('update')
  updateComments(
    @Query('idNews') idNews,
    @Body() comment: CommentUpdateDto,
  ): Promise<CommentsEntity[] | boolean> {
    return this.commentsService.updateComments(idNews, comment);
  }

  // @Post()
  // create(@Query('idNews') idNews, @Body() comment): Promise<number> {
  //   return this.commentsService.create(idNews, comment);
  // }

  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Query('idNews') idNews,
    @Body() comment,
    @UploadedFiles() cover: Express.Multer.File,
    @Request() req,
  ) {
    let coverPath;

    if (cover[0]?.filename?.length > 0) {
      coverPath = PATH_NEWS + cover[0].filename;
      comment.cover = coverPath;
    }
    // create(@Query('idNews') idNews, @Body() comment): Promise<number> {
    //   return this.commentsService.create(idNews, comment);
    // }
    return this.commentsService.create(idNews, comment, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') idComment): Promise<CommentsEntity[]> {
    return this.commentsService.remove(idComment);
  }

  @Delete('all')
  removeAll(@Query('idNews') idNews): Promise<CommentsEntity[]> {
    return this.commentsService.removeAll(idNews);
  }
}
