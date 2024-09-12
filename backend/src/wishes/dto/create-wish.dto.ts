import { IsNumber, IsPositive, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(2, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsPositive()
  @IsNumber()
  price: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
