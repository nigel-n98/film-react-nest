import { Injectable } from '@nestjs/common';
import { CreateOrderRequestDto } from './dto/create-order-request.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { FilmsRepository } from '../repository/films.repository';
import * as crypto from 'crypto';
import { OrderItemDto } from './dto/order-item.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderRequestDto): Promise<OrderResponseDto> {
    const items: OrderItemDto[] = [];

    for (const ticket of dto.tickets) {
      const seat = `${ticket.row}:${ticket.seat}`;

      await this.filmsRepository.reserveSeat(ticket.film, ticket.session, seat);

      items.push({
        ...ticket,
        id: crypto.randomUUID(),
      });
    }

    return {
      total: items.length,
      items,
    };
  }
}
