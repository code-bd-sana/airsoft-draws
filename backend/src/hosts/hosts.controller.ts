import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HostsService } from './hosts.service';

@ApiTags('Hosts')
@Controller('api/v1/hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified hosts (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of all verified host profiles',
  })
  findAllVerifiedPublic() {
    return this.hostsService.findAllVerifiedPublic();
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a single host profile by slug (public)' })
  @ApiParam({
    name: 'slug',
    description: 'The unique URL slug of the host profile',
  })
  @ApiResponse({ status: 200, description: 'Host profile details' })
  @ApiResponse({ status: 404, description: 'Host not found' })
  findOnePublic(@Param('slug') slug: string) {
    return this.hostsService.findOnePublic(slug);
  }
}
