import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HostsService } from './hosts.service';

@ApiTags('Hosts')
@Controller('api/v1/hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Get('verified')
  @ApiOperation({ summary: 'Get all verified hosts (public)' })
  findAllVerifiedPublic() {
    return this.hostsService.findAllVerifiedPublic();
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Get a single host profile by slug (public)' })
  findOnePublic(@Param('slug') slug: string) {
    return this.hostsService.findOnePublic(slug);
  }
}
