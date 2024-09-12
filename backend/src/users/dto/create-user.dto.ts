import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Имя пользователя может содеражать только буквы, цифры и знак _',
  })
  username: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  password: string;
}
