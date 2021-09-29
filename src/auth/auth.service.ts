import { UserEntity } from './../user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByCond({ email, password: pass });
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: UserEntity) {
    const { password, ...userData } = user;
    const payload = { email: user.email, sub: user.id };
    return {
      ...userData,
      access_token: this.jwtService.sign(payload),
    };
  }
}
