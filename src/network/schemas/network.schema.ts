import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NetworkDocument = HydratedDocument<Network>;

@Schema()
export class EdgeSubDocument {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  cost: number;

  @Prop({ type: Number, default: null })
  timeCost: number | null;

  @Prop({ default: false })
  isHighway: boolean;
}

export const EdgeSubDocumentSchema = SchemaFactory.createForClass(EdgeSubDocument);

@Schema({ timestamps: true })
export class Network {
  @Prop({ type: [EdgeSubDocumentSchema], required: true })
  edges: EdgeSubDocument[];

  @Prop({ type: [String], required: true })
  nodes: string[];
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
