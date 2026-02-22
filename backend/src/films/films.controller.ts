import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto } from './dto/films-response.dto';
import { FilmScheduleResponseDto } from './dto/film-schedule-response.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<FilmsResponseDto> {
    return await this.filmsService.getFilms();
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<FilmScheduleResponseDto> {
    return await this.filmsService.getSchedule(id);
  }
}
