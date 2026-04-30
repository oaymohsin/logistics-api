import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UploadNetworkDto } from './dtos/upload-network.dto';
import { NetworkService } from './network.service';

@ApiTags('Network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Upload a new graph network',
    description:
      'Accepts a list of edges (with optional timeCost and isHighway fields) and persists the graph. Returns the ID of the saved network.',
  })
  @ApiBody({ type: UploadNetworkDto })
  @ApiCreatedResponse({
    description: 'Network successfully created',
    schema: {
      example: { id: '6638a1f4e13c2a001c9f3b22' },
    },
  })
  async upload(@Body() dto: UploadNetworkDto): Promise<{ id: string }> {
    return this.networkService.upload(dto);
  }

  @Get('nodes/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all nodes of a network',
    description: 'Retrieves all unique node names for the given network ID.',
  })
  @ApiParam({ name: 'id', description: 'The network ID returned from POST /network/upload' })
  @ApiOkResponse({
    description: 'List of node names',
    schema: {
      example: { nodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
    },
  })
  @ApiNotFoundResponse({ description: 'Network not found' })
  async getNodes(@Param('id') id: string): Promise<{ nodes: string[] }> {
    return this.networkService.getNodes(id);
  }
}
