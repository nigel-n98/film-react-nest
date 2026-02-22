import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'films' })
export class FilmEntity extends Document {
  @Prop({ required: true })
  id: string;

  @Prop()
  rating?: number;

  @Prop()
  director?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop()
  title?: string;

  @Prop()
  about?: string;

  @Prop()
  description?: string;

  @Prop()
  image?: string;

  @Prop()
  cover?: string;

  @Prop({
    type: [
      {
        id: String,
        daytime: String,
        hall: Number,
        rows: Number,
        seats: Number,
        price: Number,
        taken: [String],
      },
    ],
    default: [],
  })
  schedule: {
    id: string;
    daytime: string;
    hall: number;
    rows: number;
    seats: number;
    price: number;
    taken: string[];
  }[];
}

export const FilmSchema = SchemaFactory.createForClass(FilmEntity);
