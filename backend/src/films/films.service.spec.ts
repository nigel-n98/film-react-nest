import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../entities/film.entity';
import { Schedule } from '../entities/schedule.entity';

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: jest.Mocked<FilmsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            reserveSeat: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(FilmsService);
    repository = module.get(FilmsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFilms', () => {
    it('should correctly map Film to FilmDto and return total', async () => {
      const films: Film[] = [
        {
          id: '1',
          title: 'Film 1',
          about: 'About 1',
          description: 'Description 1',
          image: 'image1.jpg',
          cover: 'cover1.jpg',
          rating: 8.5,
          director: 'Director 1',
          tags: ['tag1'],
          schedules: [],
        },
      ];

      repository.findAll.mockResolvedValue(films);

      const result = await service.getFilms();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result.total).toBe(1);
      expect(result.items).toEqual([
        {
          id: '1',
          title: 'Film 1',
          about: 'About 1',
          description: 'Description 1',
          image: 'image1.jpg',
          cover: 'cover1.jpg',
          rating: 8.5,
          director: 'Director 1',
          tags: ['tag1'],
        },
      ]);
    });

    it('should return empty array and total 0 when no films', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.getFilms();

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('getSchedule', () => {
    it('should map schedules correctly including hall conversion and taken fallback', async () => {
      const mockFilm: Film = {
        id: '1',
        title: '',
        about: '',
        description: '',
        image: '',
        cover: '',
        rating: 0,
        director: '',
        tags: [],
        schedules: [],
      };

      const schedules: Schedule[] = [
        {
          id: 's1',
          daytime: '10:00',
          hall: 3,
          rows: 10,
          seats: 20,
          price: 500,
          taken: ['2:5'],
          film: mockFilm,
        },
        {
          id: 's2',
          daytime: '12:00',
          hall: 5,
          rows: 8,
          seats: 15,
          price: 400,
          taken: undefined,
          film: mockFilm,
        },
      ];

      mockFilm.schedules = schedules;

      repository.findById.mockResolvedValue(mockFilm);

      const result = await service.getSchedule('1');

      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result.total).toBe(2);
      expect(result.items).toEqual([
        {
          id: 's1',
          daytime: '10:00',
          hall: '3',
          rows: 10,
          seats: 20,
          price: 500,
          taken: ['2:5'],
        },
        {
          id: 's2',
          daytime: '12:00',
          hall: '5',
          rows: 8,
          seats: 15,
          price: 400,
          taken: [],
        },
      ]);
    });

    it('should return empty schedules when none exist', async () => {
      const film: Film = {
        id: '1',
        title: '',
        about: '',
        description: '',
        image: '',
        cover: '',
        rating: 0,
        director: '',
        tags: [],
        schedules: [],
      };

      repository.findById.mockResolvedValue(film);

      const result = await service.getSchedule('1');

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });

    it('should throw NotFoundException when film not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getSchedule('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
