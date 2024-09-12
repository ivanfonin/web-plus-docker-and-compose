import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RemoveEmailInterceptor } from 'src/interceptors/remove-email-interceptor';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@UseInterceptors(RemoveEmailInterceptor)
@UseInterceptors(RemovePasswordInterceptor)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @Req() req): Promise<Offer> {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
