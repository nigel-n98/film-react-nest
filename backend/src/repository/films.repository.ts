import { Film } from '../entities/film.entity';

export abstract class FilmsRepository {
  abstract findAll(): Promise<Film[]>;
  abstract findById(id: string): Promise<Film | null>;
  abstract reserveSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void>;
}
