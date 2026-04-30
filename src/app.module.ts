import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { databaseConfig } from './config/database.config';
import { NetworkModule } from './network/network.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // Make ConfigService available everywhere
    }),
    MongooseModule.forRootAsync(databaseConfig),
    NetworkModule,
    RouteModule,
  ],
})
export class AppModule {}
