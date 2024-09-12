import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
