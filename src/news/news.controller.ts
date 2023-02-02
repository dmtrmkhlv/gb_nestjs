import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UploadedFile,
  Render,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { News } from 'src/dto/news.dto';
import { newsTemplate } from 'src/views/newsTemplate';
import { htmlTemplate } from 'src/views/template';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utility/HelperFileLoader';
import { LoggingInterceptor } from 'src/common/middleware/logging.interceptor';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';

const PATH_NEWS = '/news-static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.path = PATH_NEWS;

@Controller('news')
@UseInterceptors(LoggingInterceptor)
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
    private mailService: MailService,
  ) {}

  // @Post()
  // async create(@Body() news: NewsCreateDto): Promise<number> {
  //   return this.newsService.create(news);
  // }

  @Post('/update')
  async updateNews(@Body() data: News): Promise<News> {
    return this.newsService.updateNews(data);
  }

  @Get('all')
  async getAllNews(): Promise<News[]> {
    return this.newsService.getAllNews();
  }

  @Get('/:id')
  @Render('news')
  async findNews(@Param() params: NewsIdDto): Promise<News | undefined> {
    return this.newsService.getOneNews(params.id);
  }

  @Delete(':id')
  async remove(@Param() params: NewsIdDto): Promise<boolean> {
    return (
      this.newsService.remove(params.id) &&
      this.commentService.removeAll(params.id)
    );
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = await this.newsService.getAllNews();
    return htmlTemplate(newsTemplate(news));
  }

  @Get('/:id/detail')
  @Render('news-comments')
  async getViewOne(@Param('id') id: number): Promise<News | undefined> {
    const oneNews = await this.newsService.getOneNews(id);
    const oneNewsComments = await this.commentService.findAll(id);
    oneNews.comments = oneNewsComments;
    return oneNews;
  }
  // async getViewOne(@Param('id') id: string): Promise<string> {
  //   const oneNews = await this.newsService.getOneNews(id);
  //   const oneNewsComments = await this.commentService.findAll(id);
  //   return htmlTemplate(newsTemplate([oneNews], oneNewsComments));
  // }

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: helperFileLoader.destinationPath,
  //       filename: helperFileLoader.customFileName,
  //     }),
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  // uploadFile(@UploadedFiles() file: Express.Multer.File[]) {}
  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName,
      }),
    }),
  )
  // async create(
  //   @Body() news: News,
  //   @UploadedFiles() cover: Express.Multer.File,
  // ) {
  //   let coverPath;
  //   if (cover[0]?.filename?.length > 0) {
  //     coverPath = PATH_NEWS + cover[0].filename;
  //   }

  //   const _news = this.newsService.create({
  //     ...news,
  //     id: uuidv4(),
  //     cover: coverPath,
  //   });

  //   await this.mailService.sendNewNewsForAdmins(
  //     ['snezhkinv@yandex.ru', 'snezhkinv20@gmail.com'],
  //     await _news,
  //   );
  //   return _news;
  // }
  async create(@Body() news: News, @UploadedFile() cover: Express.Multer.File) {
    // Поиск пользователя по его ID
    const _user = await this.usersService.findById(news.authorId);
    if (!_user) {
      throw new HttpException(
        'Не существует такого автора',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Поиск категории по её ID
    const _category = await this.categoriesService.findById(news.categoryId);
    if (!_category) {
      throw new HttpException(
        'Не существует такой категории',
        HttpStatus.BAD_REQUEST,
      );
    }
    const _newsEntity = new NewsEntity();
    if (cover?.filename) {
      _newsEntity.cover = PATH_NEWS + cover.filename;
    }
    _newsEntity.title = news.title;
    _newsEntity.description = news.description;
    // Добавление пользователя в связь
    _newsEntity.author = _user;
    // Добавление категории в связь
    _newsEntity.category = _category;
    const _news = await this.newsService.create(_newsEntity);
    await this.mailService.sendNewNewsForAdmins(
      ['snezhkinv@yandex.ru', 'snezhkinv20@gmail.com'],
      _news,
    );
    return _news;
  }
}
