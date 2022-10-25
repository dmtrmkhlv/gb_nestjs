import { Injectable } from '@nestjs/common';
import { News } from '../dto/news.dto';
import { NewsCreateDto } from './dtos/news-create.dto';

const allNews: News[] = [
  {
    id: '1',
    title: '«Биткоин будет стоить $2 млн»: новый прогноз',
    description:
      'Эксперт настроен очень оптимистично. По его словам, в течение шести лет цифровая валюта увеличится в цене в 100 раз.',
    author: 'Pushkin',
    createdAt: new Date(Date.now()),
    cover: 'news-static/3a449395-181e-498b-86cb-c299147cf230.jpg',
    comments: [],
  },
  {
    id: '2',
    title: 'Ноутбук для жизни и работы. Какой он',
    description:
      'Так что без лишних слов и лирических отступлений на технические характеристики расскажем об эмоциях от использования',
    author: 'Pushkin',
    createdAt: new Date(Date.now()),
    cover: 'news-static/3a449395-181e-498b-86cb-c299147cf230.jpg',
    comments: [],
  },
];
@Injectable()
export class NewsService {
  async updateNews(data: News): Promise<News> {
    let news = allNews[data[0].id];
    if (news) {
      let newData = {
        ...news,
        ...data[0],
      };
      allNews[data.id] = newData;

      return allNews[data.id];
    }
  }

  async create(news: NewsCreateDto): Promise<number> {
    return allNews.push(news);
  }

  async findNews(id: string): Promise<News | undefined> {
    return allNews[id];
  }

  async getAllNews(): Promise<News[]> {
    return allNews;
  }

  async getOneNews(id: string): Promise<News | undefined> {
    const index = allNews.findIndex((x) => x.id === id);
    return allNews[index];
  }

  async remove(idNews: string): Promise<boolean> {
    const index = allNews?.[idNews].findIndex((x) => x.id === idNews);
    if (index !== -1) {
      allNews[idNews].splice(index, 1);
      return true;
    }
    return false;
  }
}
