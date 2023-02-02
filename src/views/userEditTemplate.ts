import { Role } from 'src/auth/role/role.enum';
import { UserCreateDto } from 'src/users/dto/user-create.dto';

export const userEditTemplate = (id, user: UserCreateDto) => {
  if (!user) {
    return userNotFound();
  }

  if (id != user.id) {
    return userEditForbidden();
  }

  let html = '<div class="">';

  html += `<form action="" method="get" class="form-example">
  <div class="form-example">
    <label for="firstName">firstName: </label>
    <input type="text" name="firstName" id="firstName" required value="${user.firstName}">
  </div>

  <div class="form-example">
  <label for="lastName">lastName: </label>
  <input type="text" name="lastName" id="lastName" required value="${user.lastName}">
</div>`;

  html += `<div class="form-example">
<label for="role">role: </label>
<select name="role"> `;

  for (const property in Role) {
    if (Role[property] === user.role) {
      html += `<option value="${user.role}" selected>${user.role}</option>`;
    } else {
      html += `<option value="${Role[property]}">${Role[property]}</option>`;
    }
  }
  html += `</select>
</div>`;

  html += `<div class="form-example">
<label for="lastName">email: </label>
<input type="email" name="email" id="email" required value="${user.email}">
</div>

<div class="form-example">
<label for="password">password: </label>
<input type="password" name="password" id="password" required value="${user.password}">
</div>

  <div class="form-example">
    <input type="submit" value="Сохранить"> 
    </div>
    </form>`;

  html += '</div>';
  return html;
};
const userNotFound = () => {
  return `<h1>Пользователь не найден!</h1>`;
};
const userEditForbidden = () => {
  return `<h1>Редактирование запрещено!</h1>`;
};
