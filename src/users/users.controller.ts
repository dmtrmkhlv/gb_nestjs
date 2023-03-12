import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { htmlTemplate } from 'src/views/template';
import { userTemplate } from 'src/views/userTemplate';
import { userEditTemplate } from 'src/views/userEditTemplate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async create(@Body() userCreateDto: UserCreateDto): Promise<UsersEntity> {
    return this.usersService.create(userCreateDto);
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<UsersEntity> {
    return this.usersService.updateUser(id, userUpdateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('update/:id')
  async gerUpdateUser(@Request() req, @Param('id') id): Promise<string> {
    const user = await this.usersService.getOneUser(id);
    return htmlTemplate(userEditTemplate(req.user.userId, user));
  }

  @Get(':id')
  async getViewUser(@Param('id') id): Promise<string> {
    const user = await this.usersService.getOneUser(id);
    return htmlTemplate(userTemplate(user));
  }
}
