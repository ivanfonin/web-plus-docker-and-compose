import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Not, QueryFailedError, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmail } from 'class-validator';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepository.save(createUserDto);
      return user;
    } catch (err) {
      if (err instanceof QueryFailedError) {
        if (err.driverError.code === '23505') {
          const detail = err.driverError.detail;
          let field = 'data';

          // Извлекаем информацию об ошибке.
          if (detail.includes('username')) {
            field = 'username';
          } else if (detail.includes('email')) {
            field = 'email';
          }

          throw new ConflictException(
            'Пользователь с такими данными уже существует',
          );
        }
      }
      throw err; // Если не поймали, то выбросим снова
    }
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return user;
  }

  async findOne(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`Пользователь ${username} не найден`);
    }

    return user;
  }

  async findMany(query: string) {
    const user = isEmail(query)
      ? await this.findByEmail(query)
      : await this.findByUsername(query);

    if (!user) {
      throw new NotFoundException(`Не удалось найти пользователей`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return await this.userRepository.find({
      where: { username: Like(`%${username}%`) },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    // Сначала проверим нет ли пользователя с таким email в БД
    if (updateUserDto.hasOwnProperty('email')) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email, id: Not(id) },
      });
  
      if (existingUser) {
        throw new ConflictException(`Пользователь с таким email уже существует`);
      }
    }

    if (updateUserDto.hasOwnProperty('password')) {
      const hashedPassword = await this.hashService.hash(
        updateUserDto.password,
      );
      updateUserDto = { ...updateUserDto, password: hashedPassword };
    }

    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return this.findById(id);
  }

  async removeOne(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new ForbiddenException(`Не удается удалить пользователя`);
    }

    return this.userRepository.delete(id);
  }

  async findUserWishes(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });

    if (!user) {
      throw new BadRequestException(`Пользователь не найден`);
    }

    return user.wishes;
  }

  async findUsernameWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });

    if (!user) {
      throw new BadRequestException(`Пользователь не найден`);
    }

    return user.wishes;
  }
}
