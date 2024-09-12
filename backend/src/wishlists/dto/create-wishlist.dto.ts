import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
