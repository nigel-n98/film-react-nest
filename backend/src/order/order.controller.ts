import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    return this.orderService.create(dto);
  }
}
