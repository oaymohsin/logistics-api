import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EdgeDto {
  @ApiProperty({
    description: 'The starting node of the edge',
    example: 'A',
  })
  @IsString()
  from: string;

  @ApiProperty({
    description: 'The ending node of the edge',
    example: 'B',
  })
  @IsString()
  to: string;

  @ApiProperty({
    description: 'The cost/distance weight of this edge (used for shortest preference)',
    example: 10,
  })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiPropertyOptional({
    description: 'The time cost weight of this edge (used for fastest preference)',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  timeCost?: number;

  @ApiPropertyOptional({
    description: 'Whether this edge represents a highway (used for avoidHighways constraint)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isHighway?: boolean;
}
