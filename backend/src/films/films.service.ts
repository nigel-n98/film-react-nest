import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto } from './dto/films-response.dto';
import { FilmScheduleResponseDto } from './dto/film-schedule-response.dto';
import { ScheduleDto } from './dto/schedule.dto';
import { FilmDto } from './dto/film.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();

    const items: FilmDto[] = films.map((film) => ({
      id: film.id,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async getSchedule(id: string): Promise<FilmScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    const items: ScheduleDto[] = film.schedules.map((schedule) => ({
      id: schedule.id,
      daytime: schedule.daytime,
      hall: String(schedule.hall),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken ?? [],
    }));

    return {
      total: items.length,
      items,
    };
  }
}
