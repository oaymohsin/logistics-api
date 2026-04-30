import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RouteConstraintsDto {
  @ApiPropertyOptional({
    description:
      'When true, edges marked as highways are excluded from the path calculation',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  avoidHighways?: boolean;
}

export class OptimizeRouteDto {
  @ApiProperty({
    description: 'The starting node ID in the graph',
    example: 'A',
  })
  @IsString()
  originNodeId: string;

  @ApiProperty({
    description: 'The target/destination node ID in the graph',
    example: 'E',
  })
  @IsString()
  destinationNodeId: string;

  @ApiPropertyOptional({
    description:
      '"shortest" uses the cost field; "fastest" uses the timeCost field (falls back to cost if timeCost is not set)',
    enum: ['shortest', 'fastest'],
    default: 'shortest',
  })
  @IsOptional()
  @IsIn(['shortest', 'fastest'])
  preference?: 'shortest' | 'fastest';

  @ApiPropertyOptional({
    description: 'Optional routing constraints',
    type: RouteConstraintsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RouteConstraintsDto)
  constraints?: RouteConstraintsDto;
}
