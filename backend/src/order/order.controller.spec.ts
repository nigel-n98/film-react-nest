import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrderResponseDto } from './dto/order-response.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(OrderController);
    orderService = module.get(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create order', async () => {
    const dto: CreateOrderRequestDto = {
      email: 'test@mail.com',
      phone: '123456',
      tickets: [],
    };

    const result: OrderResponseDto = {
      total: 0,
      items: [],
    };

    orderService.create.mockResolvedValue(result);

    const response = await controller.create(dto);

    expect(orderService.create).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });
});
