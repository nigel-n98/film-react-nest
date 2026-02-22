import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';
import { FilmsRepository } from './films.repository';

@Injectable()
export class PostgresFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll() {
    return this.filmRepository.find({
      order: { title: 'ASC' },
    });
  }

  async findById(id: string) {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedules'],
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    if (film.schedules) {
      film.schedules.sort((a, b) => a.daytime.localeCompare(b.daytime));
    }

    return film;
  }

  async reserveSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId },
      relations: ['film'],
    });

    if (!schedule || schedule.film.id !== filmId) {
      throw new NotFoundException('Session not found');
    }

    const takenSeats = schedule.taken ?? [];

    if (takenSeats.includes(seat)) {
      throw new BadRequestException(`Seat ${seat} is already taken`);
    }

    takenSeats.push(seat);
    schedule.taken = takenSeats;

    await this.scheduleRepository.save(schedule);
  }
}
