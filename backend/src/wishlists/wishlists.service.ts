import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = createWishlistDto;

    const wishes = await this.wishesService.findMany(itemsId);

    const user = await this.usersService.findById(userId);

    return await this.wishlistRepository.save({
      name,
      image,
      owner: user,
      items: wishes,
    });
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlists) {
      throw new NotFoundException(`Списки не найден`);
    }

    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Список не найден`);
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(`Нет прав для удаления списка`);
    }

    const updateData: any = { ...updateWishlistDto };

    if ('itemsId' in updateWishlistDto) {
      updateData.items = await this.wishesService.findMany(
        updateWishlistDto.itemsId,
      );
    }

    const updated = await this.wishlistRepository.save({
      ...wishlist,
      ...updateData,
    });

    if (!updated) {
      throw new BadRequestException(`Ошибка при обновлении списка`);
    }

    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(`Нет прав для удаления списка`);
    }

    await this.wishlistRepository.delete(id);

    return wishlist;
  }
}
