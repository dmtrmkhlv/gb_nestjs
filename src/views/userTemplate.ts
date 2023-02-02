import { UserCreateDto } from 'src/users/dto/user-create.dto';

export const userTemplate = (user: UserCreateDto) => {
  if (!user) {
    return userNotFound();
  }

  let html = '<div class="">';

  for (const property in user) {
    html += `<p>${property}: ${user[property]}</p>`;
  }
  html += `<a href="./update/${user.id}">Редактировать</a>`;
  html += '</div>';
  return html;
};
const userNotFound = () => {
  return `<h1>Пользователь не найден!</h1>`;
};
