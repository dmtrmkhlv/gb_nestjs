import { Injectable } from '@nestjs/common';
import { News } from '../dto/news.dto';

const allNews: News[] = [
  {
    id: 1,
    title: '«Биткоин будет стоить $2 млн»: новый прогноз',
    description:
      'Эксперт настроен очень оптимистично. По его словам, в течение шести лет цифровая валюта увеличится в цене в 100 раз.',
    author: 'Pushkin',
    createdAt: new Date(Date.now()),
  },
  {
    id: 2,
    title: 'Ноутбук для жизни и работы. Какой он',
    description:
      'Так что без лишних слов и лирических отступлений на технические характеристики расскажем об эмоциях от использования',
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

      return allNews[data.id - 1];
    }
  }

  async findNews(id: number): Promise<News | undefined> {
    return allNews[id - 1];
  }

  async getAllNews(): Promise<News[]> {
    return allNews;
  }
  async remove(idNews): Promise<boolean> {
    const index = News?.[idNews].findIndex((x) => x.id === idNews);
    if (index !== -1) {
      News[idNews].splice(index, 1);
      return true;
    }
    return false;
  }
}
