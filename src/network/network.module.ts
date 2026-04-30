import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Network, NetworkSchema } from './schemas/network.schema';
import { NetworkController } from './network.controller';
import { NetworkService } from './network.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Network.name, schema: NetworkSchema }]),
  ],
  controllers: [NetworkController],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
