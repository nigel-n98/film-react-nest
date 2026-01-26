import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilmEntity } from './schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(FilmEntity.name)
    private readonly filmModel: Model<FilmEntity>,
  ) {}

  async findAll() {
    return this.filmModel.find().lean();
  }

  async findById(id: string) {
    const film = await this.filmModel.findOne({ id }).lean();

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return film;
  }

  // async getSession(filmId: string, sessionId: string) {
  //   const film = await this.filmModel.findOne({ id: filmId }).lean();

  //   if (!film) {
  //     throw new NotFoundException('Film not found');
  //   }

  //   const session = film.schedule.find((s) => s.id === sessionId);

  //   if (!session) {
  //     throw new NotFoundException('Session not found');
  //   }

  //   return { film, session };
  // }

  async reserveSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void> {
    const film = await this.filmModel.findOne({ id: filmId });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const session = film.schedule.find((s) => s.id === sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.taken.includes(seat)) {
      throw new BadRequestException(`Seat ${seat} is already taken`);
    }

    session.taken.push(seat);
    await film.save();
  }
}
