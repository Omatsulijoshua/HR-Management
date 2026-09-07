import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Check API, Database, and Redis health status' })
  @ApiResponse({ status: 200, description: 'Health check details' })
  async checkHealth() {
    let dbStatus = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    const redisHealthy = await this.redis.isHealthy();
    const redisStatus = redisHealthy ? 'up' : 'down';

    const overallStatus = dbStatus === 'up' && redisStatus === 'up' ? 'ok' : 'degraded';

    return {
      status: overallStatus,
      info: {
        database: { status: dbStatus },
        redis: { status: redisStatus },
        uptime: process.uptime(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
