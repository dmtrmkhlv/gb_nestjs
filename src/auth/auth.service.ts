import { JwtService } from '@nestjs/jwt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { compare } from 'src/utility/crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async verify(token: string) {
    return this.jwtService.verify(token);
  }
}
