import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId?: number[];
}
