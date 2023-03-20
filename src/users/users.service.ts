import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { Role } from '../auth/role/role.enum';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { hash } from 'src/utility/crypto';

const allUsers: UserCreateDto[] = [
  {
    id: '1',
    firstName: 'admin',
    lastName: 'admin',
    email: 'admin@mail.ru',
    password: 'admin',
    role: Role.Admin,
  },
];

// export type User = any;
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: UserCreateDto) {
    const userEntity = new UsersEntity();
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.roles = user.role;
    userEntity.password = await hash(user.password);
    return await this.usersRepository.save(user);
  }

  async updateUser(id, updateUser: UserUpdateDto): Promise<UsersEntity> {
    const user = await this.usersRepository.findOneBy(id);
    updateUser.updatedAt = new Date();
    return await this.usersRepository.save({ ...user, updateUser });
  }

  async findById(id): Promise<UsersEntity> {
    return this.usersRepository.findOne(id);
  }

  async getOneUser(id: string): Promise<UserCreateDto | undefined> {
    const index = allUsers.findIndex((x) => x.id == id);
    return allUsers[index];
  }
  async findByEmail(email): Promise<UsersEntity> {
    return this.usersRepository.findOne(email);
  }
  async setModerator(idUser): Promise<UsersEntity> {
    const _user = await this.findById(idUser);
    if (!_user) {
      throw new UnauthorizedException();
    }
    _user.roles = Role.Moderator;
    return this.usersRepository.save(_user);
  }
}
