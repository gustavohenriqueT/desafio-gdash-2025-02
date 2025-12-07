import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { sub: user._id, username: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
          name: user.name,
          email: user.email
      }
    };
  }
}