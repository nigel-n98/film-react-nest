import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmEntity, FilmSchema } from '../repository/schemas/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FilmEntity.name, schema: FilmSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, FilmsRepository],
})
export class OrderModule {}
