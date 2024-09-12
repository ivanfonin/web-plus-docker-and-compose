import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Offer } from 'src/offers/entities/offer.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  private filterWishOffers(offers: Offer[]): Offer[] {
    return offers.filter((offer) => !offer.hidden);
  }

  async create(userId: number, createWishDto: CreateWishDto): Promise<Wish> {
    return await this.wishRepository.save({
      ...createWishDto,
      owner: { id: userId },
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true },
      order: { copied: 'DESC' },
      take: 20,
    });

    if (!wishes) {
      throw new NotFoundException(`Подаки не найдены`);
    }

    return wishes.map((wish) => ({
      ...wish,
      offers: this.filterWishOffers(wish.offers),
    }));
  }

  async getLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: { owner: true, offers: true },
      order: { createdAt: 'DESC' },
      take: 40,
    });

    if (!wishes) {
      throw new NotFoundException(`Подаки не найдены`);
    }

    return wishes.map((wish) => ({
      ...wish,
      offers: this.filterWishOffers(wish.offers),
    }));
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new NotFoundException(`Подарок не найден`);
    }

    wish.offers = this.filterWishOffers(wish.offers);

    return wish;
  }

  async findMany(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { id: In(ids) },
    });

    if (!wishes) {
      throw new NotFoundException(`Подарки не найдены`);
    }

    return wishes;
  }

  async update(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Нет прав для редактирования подарка`);
    }

    if (updateWishDto.hasOwnProperty('price') && wish.raised > 0) {
      throw new ForbiddenException(
        `Нельзя редактировать стоимость подарка, на который уже начали скидываться`,
      );
    }

    // Обновляем только свойства, перечисленные в Dto, исключаем обновление copied и raised.
    if (updateWishDto.name !== undefined) wish.name = updateWishDto.name;
    if (updateWishDto.link !== undefined) wish.link = updateWishDto.link;
    if (updateWishDto.image !== undefined) wish.image = updateWishDto.image;
    if (updateWishDto.price !== undefined) wish.price = updateWishDto.price;
    if (updateWishDto.description !== undefined)
      wish.description = updateWishDto.description;

    const savedWish = await this.wishRepository.save(wish);

    savedWish.offers = this.filterWishOffers(wish.offers);

    return savedWish;
  }

  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Нет прав для удаления подарка`);
    }

    this.wishRepository.delete(id);
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.findOne(id);

      if (wish.owner.id === userId) {
        throw new ForbiddenException(`Нельзя копировать свой же подарок`);
      }

      // Копируем подарок, указывая нового owner
      const copiedWish = queryRunner.manager.create(Wish, {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
        owner: { id: userId },
        raised: 0,
        copied: 0,
      });

      // Сохраняем новый подарок в базе
      await queryRunner.manager.save(copiedWish);

      // У копируемого подарка увеличиваем copied на 1 и сохраняем
      wish.copied += 1;
      await queryRunner.manager.save(wish);

      await queryRunner.commitTransaction();

      copiedWish.offers = this.filterWishOffers(wish.offers);

      return copiedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Копирование подарка не удалось`);
    } finally {
      await queryRunner.release();
    }
  }
}
