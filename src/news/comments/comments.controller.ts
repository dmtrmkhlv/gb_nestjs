import { FilesInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Comment } from 'src/dto/comment.dto';

import { CommentsService } from './comments.service';
import { CommentUpdateDto } from './dtos/comment-update.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utility/HelperFileLoader';

const PATH_NEWS = '/comment-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

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
  ) {
    let coverPath;

    if (cover[0]?.filename?.length > 0) {
      coverPath = PATH_NEWS + cover[0].filename;
      comment.cover = coverPath;
    }
    // create(@Query('idNews') idNews, @Body() comment): Promise<number> {
    //   return this.commentsService.create(idNews, comment);
    // }
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
