import { Injectable } from '@nestjs/common';
import { News } from '../dto/news.dto';

const allNews: News[] = [
  {
    id: 1,
    title: 'title',
    description: 'description',
    author: 'Pushkin',
    createdAt: new Date(Date.now()),
  },
];
@Injectable()
export class NewsService {
  async updateNews(data: News): Promise<News> {
    let news = allNews[data[0].id - 1];
    if (news) {
      let newData = {
        ...news,
        ...data[0],
      };
      allNews[data.id - 1] = newData;
      console.log(news, newData);
      return allNews[data.id - 1];
    }
  }

  async findNews(id: number): Promise<News | undefined> {
    return allNews[id - 1];
  }

  async getAllNews(): Promise<News[]> {
    return allNews;
  }
}
