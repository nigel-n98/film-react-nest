// import { Test, TestingModule } from '@nestjs/testing';
// import { OrderService } from './order.service';

// describe('OrderService', () => {
//   let service: OrderService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [OrderService],
//     }).compile();

//     service = module.get<OrderService>(OrderService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';

describe('OrderService', () => {
  let service: OrderService;
  let repository: jest.Mocked<FilmsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
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

    service = module.get(OrderService);
    repository = module.get(FilmsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reserve seat and return order', async () => {
    const dto: CreateOrderRequestDto = {
      email: 'test@mail.com',
      phone: '123456',
      tickets: [
        {
          film: '1',
          session: '1',
          daytime: '10:00',
          row: 2,
          seat: 3,
          price: 500,
        },
      ],
    };

    repository.reserveSeat.mockResolvedValue(undefined);

    const result = await service.create(dto);

    expect(repository.reserveSeat).toHaveBeenCalledWith(
      '1',
      '1',
      '2:3',
    );

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBeDefined();
  });
});