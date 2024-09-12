import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { RemoveEmptyFieldsInterceptor } from 'src/interceptors/remove-empty-fields.interceptor';
import { RemoveEmailInterceptor } from 'src/interceptors/remove-email-interceptor';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseInterceptors(RemovePasswordInterceptor)
  getUser(@Req() req) {
    return req.user;
  }

  @Patch('me')
  @UseInterceptors(RemoveEmptyFieldsInterceptor)
  @UseInterceptors(RemovePasswordInterceptor)
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req): Promise<User> {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getUserWishes(@Req() req) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Post('find')
  @UseInterceptors(RemovePasswordInterceptor)
  @UseInterceptors(RemoveEmailInterceptor)
  find(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findMany(query);
  }

  @Get(':username')
  @UseInterceptors(RemovePasswordInterceptor)
  @UseInterceptors(RemoveEmailInterceptor)
  getByUsername(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  getUsernameWishes(@Param('username') username: string) {
    return this.usersService.findUsernameWishes(username);
  }
}
