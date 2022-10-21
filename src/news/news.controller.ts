import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { News } from 'src/dto/news.dto';
import { OneNews } from 'src/utility/news.decorator';
import { newsTemplate } from 'src/views/newsTemplate';
import { htmlTemplate } from 'src/views/template';
import { NewsService } from './news.service';
import { CommentsService } from './comments/comments.service';
import { NewsIdDto } from './dtos/news-id.dto';
import { NewsCreateDto } from './dtos/news-create.dto';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentsService,
  ) {}

  @Post()
  async updateNews(@Body() data: News): Promise<News> {
    return this.newsService.updateNews(data);
  }

  @Post()
  async create(@Body() news: NewsCreateDto): Promise<number> {
    return this.newsService.create(news);
  }

  @Get('all')
  async getAllNews(): Promise<News[]> {
    return this.newsService.getAllNews();
  }

  @Get('/:id')
  async findNews(
    @OneNews() news: News,
    @Param() params: NewsIdDto,
  ): Promise<News | undefined> {
    return this.newsService.findNews(params.id);
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
  async getViewOne(@Param('id') id: string): Promise<string> {
    const oneNews = await this.newsService.getOneNews(id);
    const oneNewsComments = await this.commentService.findAll(id);
    return htmlTemplate(newsTemplate([oneNews], oneNewsComments));
  }
}
