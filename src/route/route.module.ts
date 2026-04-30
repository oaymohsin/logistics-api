import { Module } from '@nestjs/common';
import { DijkstraModule } from '../dijkstra/dijkstra.module';
import { NetworkModule } from '../network/network.module';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';

@Module({
  imports: [NetworkModule, DijkstraModule],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}
