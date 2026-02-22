import { TicketDto } from './ticket.dto';

export class CreateOrderRequestDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}
