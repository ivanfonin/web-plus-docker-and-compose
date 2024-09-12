import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';
import { RemoveEmailInterceptor } from 'src/interceptors/remove-email-interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(req.user.id, createWishDto);
  }

  @UseInterceptors(RemoveEmailInterceptor)
  @UseInterceptors(RemovePasswordInterceptor)
  @Get('last')
  getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @UseInterceptors(RemoveEmailInterceptor)
  @UseInterceptors(RemovePasswordInterceptor)
  @Get('top')
  getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(RemoveEmailInterceptor)
  @UseInterceptors(RemovePasswordInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(RemoveEmailInterceptor)
  @UseInterceptors(RemovePasswordInterceptor)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.update(+id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Param('id') id: string, @Req() req) {
    return this.wishesService.copyWish(+id, req.user.id);
  }
}
