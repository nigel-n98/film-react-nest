import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsResponseDto } from './dto/films-response.dto';
import { FilmScheduleResponseDto } from './dto/film-schedule-response.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getFilms: jest.fn(),
            getSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
    filmsService = module.get(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return films', async () => {
    const result: FilmsResponseDto = {
      total: 0,
      items: [],
    };

    filmsService.getFilms.mockResolvedValue(result);

    const response = await controller.getFilms();

    expect(filmsService.getFilms).toHaveBeenCalledTimes(1);
    expect(response).toEqual(result);
  });

  it('should return schedule by id', async () => {
    const result: FilmScheduleResponseDto = {
      total: 0,
      items: [],
    };

    filmsService.getSchedule.mockResolvedValue(result);

    const response = await controller.getSchedule('1');

    expect(filmsService.getSchedule).toHaveBeenCalledWith('1');
    expect(response).toEqual(result);
  });
});
