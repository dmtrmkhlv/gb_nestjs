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
  All,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { News } from 'src/dto/news.dto';
import { newsTemplate } from 'src/views/newsTemplate';
import { htmlTemplate } from 'src/views/template';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dto/news-id.dto';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utility/HelperFileLoader';
import { LoggingInterceptor } from 'src/common/middleware/logging.interceptor';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { UsersService } from 'src/users/users.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesEntity } from 'src/categories/categories.entity';
import { UsersEntity } from 'src/users/users.entity';

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

  @Post('/update')
  async updateNews(@Body() data: News): Promise<News> {
    return this.newsService.updateNews(data);
  }

  @Get('create-news')
  async createFakeNews(): Promise<NewsEntity> {
    const newNews: NewsEntity = {
      title: 'string',
      description: 'string',
      cover: 'string',
      author: new UsersEntity(),
      createdAt: undefined,
      id: '',
      category: new CategoriesEntity(),
      updatedAt: undefined,
    };
    return this.newsService.create(newNews);
  }

  @Get()
  @Render('news-list')
  async getAllNews(): Promise<{ news: NewsEntity[] }> {
    return { news: await this.newsService.getAllNews() };
  }

  @Get('/:id')
  @Render('news')
  async findNews(@Param() params: NewsIdDto): Promise<News | undefined> {
    console.log(this.newsService.getOneNews(params.id));

    return this.newsService.getOneNews(params.id);
  }

  @Delete(':id')
  async remove(@Param() params: NewsIdDto): Promise<any> {
    return (
      this.newsService.remove(params.id) &&
      this.commentService.removeAll(params.id)
    );
  }

  @Get('/:id/detail')
  @Render('news-comments')
  async getViewOne(@Param('id') id: string): Promise<News | undefined> {
    const oneNews = await this.newsService.getOneNews(id);
    const oneNewsComments = await this.commentService.findAll(id);
    // oneNews.comments = oneNewsComments;
    return oneNews;
    // return htmlTemplate(newsTemplate([oneNews], oneNewsComments));
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
