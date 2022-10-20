import { Comment } from 'src/dto/comment.dto';
import { News } from 'src/dto/news.dto';

export const newsTemplate = (news: News[], comments?: Comment[]) => {
  if (news?.length === 0) {
    return emptyNews();
  }

  let html = '<div class="row">';
  for (const newsItem of news) {
    let commentHTML = '<div>';
    comments?.forEach((commentItem) => {
      commentHTML += `<sup>№${commentItem.id}</sup><p class="card-text">${commentItem.text}</p>`;
    });
    commentHTML += '</div>';
    html += `
    <div class="col-lg-6">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${newsItem.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    Автор: ${newsItem.author}
                </h6>
                <h6 class="card-subtitle mb-2 text-muted">
                    Дата создания: ${newsItem.createdAt}
                </h6>
                <p class="card-text">${newsItem.description}</p>
                <h6 class="card-subtitle mb-2 text-muted">
                    Комментарии:
                </h6>
                ${commentHTML}
            </div>
        </div>
    </div>
    `;
  }
  html += '</div>';
  return html;
};
const emptyNews = () => {
  return `<h1>Список новостей пуст!</h1>`;
};
