import { Injectable } from '@nestjs/common';
import { News } from '../dto/news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { UsersEntity } from 'src/users/users.entity';

const allNews: News[] = [
  {
    id: 1,
    title: '«Биткоин будет стоить $2 млн»: новый прогноз',
    description:
      'Эксперт настроен очень оптимистично. По его словам, в течение шести лет цифровая валюта увеличится в цене в 100 раз.',
    author: new UsersEntity(),
    createdAt: new Date(Date.now()),
    cover: 'news-static/3a449395-181e-498b-86cb-c299147cf230.jpg',
    // comments: [],
  },
  {
    id: 2,
    title: 'Ноутбук для жизни и работы. Какой он',
    description:
      'Так что без лишних слов и лирических отступлений на технические характеристики расскажем об эмоциях от использования',
    author: new UsersEntity(),
    createdAt: new Date(Date.now()),
    cover: 'news-static/3a449395-181e-498b-86cb-c299147cf230.jpg',
    // comments: [],
  },
];
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsRepository: Repository<NewsEntity>,
  ) {}
  async updateNews(data: News): Promise<News> {
    const news = await this.newsRepository.find({})[data[0].id];
    if (news) {
      const newData = {
        ...news,
        ...data[0],
      };
      await this.newsRepository.update(data.id, newData);
      return await this.newsRepository.find({})[data[0].id];
    }
  }

  async create(news: NewsEntity) {
    return await this.newsRepository.save(news);
  }

  async findNews(id): Promise<NewsEntity> {
    return await this.newsRepository.findOneBy(id);
  }

  async getAllNews(authorId?: number): Promise<NewsEntity[]> {
    if (authorId) {
      const allNews = await this.newsRepository.find({});
      return allNews.filter((news) => news.author.id == authorId);
    }
    return await this.newsRepository.find({});
  }

  async getOneNews(id: number): Promise<News | undefined> {
    const index = allNews.findIndex((x) => x.id == id);
    return allNews[index];
  }

  async remove(id: number) {
    const _news = await this.findNews(id);
    return await this.newsRepository.remove(_news);
  }
}
