import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { RemoveEmailInterceptor } from 'src/interceptors/remove-email-interceptor';
import { RemovePasswordInterceptor } from 'src/interceptors/remove-password.interceptor';

@UseInterceptors(RemoveEmailInterceptor)
@UseInterceptors(RemovePasswordInterceptor)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req): Promise<Wishlist> {
    return this.wishlistsService.remove(+id, req.user.id);
  }
}
