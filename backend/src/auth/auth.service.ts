import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async auth(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { username, about, avatar, email, password } = createUserDto;

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.usersService.create({
      username,
      about,
      avatar,
      email,
      password: hashedPassword,
    });

    return this.auth(user);
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await this.hashService.compare(password, user.password))) {
      delete user.password;
      return user;
    }

    return null;
  }
}
