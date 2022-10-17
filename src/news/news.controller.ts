import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Header,
} from '@nestjs/common';
import { News } from 'src/dto/news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly appService: NewsService) {}

  @Post()
  async updateNews(@Body() data: News): Promise<News> {
    return this.appService.updateNews(data);
  }

  @Get('/:id')
  async findNews(@Param('id') id: number): Promise<News | undefined> {
    return this.appService.findNews(id);
  }

  @Get('/all')
  async getAllNews(): Promise<News[]> {
    return this.appService.getAllNews();
  }
}
