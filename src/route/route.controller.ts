import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OptimizeRouteDto } from './dtos/optimize-route.dto';
import { OptimizeRouteResponse, RouteService } from './route.service';

@ApiTags('Route Optimization')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('optimize/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Calculate optimal route',
    description:
      'Calculates the shortest or fastest path between two nodes in a given network using Dijkstra algorithm.',
  })
  @ApiParam({
    name: 'id',
    description: 'The network ID returned from POST /network/upload',
  })
  @ApiBody({
    type: OptimizeRouteDto,
    examples: {
      shortest: {
        summary: 'Shortest Path (Default)',
        description: 'Finds the optimal path based on distance cost.',
        value: {
          originNodeId: 'A',
          destinationNodeId: 'E',
          preference: 'shortest',
          constraints: {
            avoidHighways: true,
          },
        },
      },
      fastest: {
        summary: 'Fastest Path',
        description: 'Finds the optimal path based on timeCost.',
        value: {
          originNodeId: 'A',
          destinationNodeId: 'E',
          preference: 'fastest',
          constraints: {
            avoidHighways: false,
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Optimal route found successfully',
    schema: {
      example: {
        graphId: '6638a1f4e13c2a001c9f3b22',
        totalCost: 25.5,
        path: ['A', 'C', 'D', 'E'],
        durationMs: 4,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or nodes not found in the graph',
  })
  @ApiNotFoundResponse({
    description: 'Network not found, or destination is unreachable',
  })
  async optimize(
    @Param('id') networkId: string,
    @Body() dto: OptimizeRouteDto,
  ): Promise<OptimizeRouteResponse> {
    return this.routeService.optimize(networkId, dto);
  }
}
