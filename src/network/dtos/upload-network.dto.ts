import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { EdgeDto } from './edge.dto';

export class UploadNetworkDto {
  @ApiProperty({
    description: 'Array of edges that define the graph network',
    type: [EdgeDto],
    example: [
      { from: 'A', to: 'B', cost: 10, timeCost: 5, isHighway: false },
      { from: 'A', to: 'C', cost: 5, timeCost: 8, isHighway: true },
      { from: 'B', to: 'D', cost: 8, timeCost: 4, isHighway: false },
      { from: 'C', to: 'D', cost: 12, timeCost: 15, isHighway: true },
      { from: 'D', to: 'E', cost: 12, timeCost: 10, isHighway: false },
      { from: 'D', to: 'F', cost: 4, timeCost: 2, isHighway: false },
      { from: 'F', to: 'G', cost: 4, timeCost: 3, isHighway: false },
      { from: 'E', to: 'G', cost: 9, timeCost: 12, isHighway: true },
      { from: 'C', to: 'H', cost: 8, timeCost: 6, isHighway: false },
      { from: 'D', to: 'H', cost: 4, timeCost: 4, isHighway: false },
      { from: 'F', to: 'H', cost: 1, timeCost: 1, isHighway: false },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[];
}
