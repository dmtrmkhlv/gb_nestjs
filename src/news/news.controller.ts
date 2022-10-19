import {
  Body,
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';
import {
  News
} from 'src/dto/news.dto';
import { OneNews } from 'src/utility/news.decorator';
import {
  newsTemplate
} from 'src/views/newsTemplate';
import {
  htmlTemplate
} from 'src/views/template';
import {
  NewsService
} from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  async updateNews(@Body() data: News): Promise<News> {
    return this.newsService.updateNews(data);
  }

  // @Get()
  // async findOne(@OneNews('title') title: string): Promise<void> {
  //   console.log(`Hello ${title}`);
  // }


  @Get('all')
  async getAllNews(): Promise<News[]> {
    return this.newsService.getAllNews();
  }

  @Get('/:id')
  async findNews(@OneNews() news: News, @Param('id') id: number): Promise<News | undefined> {
    return this.newsService.findNews(id);
  }

  @Get()
  async getViewAll(): Promise<string> {
    const news = await this.newsService.getAllNews();
    return htmlTemplate(newsTemplate(news));
  }


}