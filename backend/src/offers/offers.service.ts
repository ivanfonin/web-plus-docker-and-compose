import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await queryRunner.manager.findOne(Wish, {
        where: { id: createOfferDto.itemId },
        relations: ['owner'],
      });

      if (!wish) {
        throw new NotFoundException(`Подарок не найден`);
      }

      if (wish.owner.id === userId) {
        throw new ForbiddenException(`Нельзя скинуться на свой же подарок`);
      }

      if (Number(wish.raised) >= wish.price) {
        throw new BadRequestException(`Средства на этот подарок уже собраны`);
      }

      if (Number(wish.raised) + createOfferDto.amount > wish.price) {
        throw new BadRequestException(
          `Сумма сбора не может превышать стоимость подарка`,
        );
      }

      // Создаём новый offer
      const newOffer = queryRunner.manager.create(Offer, {
        ...createOfferDto,
        user: { id: userId },
        item: wish,
      });
      const offer = await queryRunner.manager.save(newOffer);

      // Увеличиваем сумму собранных средств на подарок и сохраняем
      wish.raised = Number(wish.raised) + createOfferDto.amount;
      await queryRunner.manager.save(wish);

      await queryRunner.commitTransaction();

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      if (
        // Если это ошибка, которую мы уже выбросили, то выбрасываем её ещё раз
        err instanceof NotFoundException ||
        err instanceof ForbiddenException ||
        err instanceof BadRequestException
      ) {
        throw err;
      } else {
        // Если какая-то новая, то выбрасываем ошибку сервера
        throw new InternalServerErrorException(`Создание оффера не удалось`);
      }
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Offer[]> {
    const offers = await this.offerRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offers) {
      throw new NotFoundException(`Предложений сброситься на подарки нет`);
    }

    return offers;
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offer) {
      throw new NotFoundException(`Предложение сброситься не найдено`);
    }

    return offer;
  }
}
