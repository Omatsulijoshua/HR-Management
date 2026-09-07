import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: any;
  let redisService: any;

  beforeEach(async () => {
    prismaService = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    };

    redisService = {
      isHealthy: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: prismaService },
        { provide: RedisService, useValue: redisService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return overall status ok when DB and Redis are up', async () => {
    const res = await controller.checkHealth();
    expect(res.status).toBe('ok');
    expect(res.info.database.status).toBe('up');
    expect(res.info.redis.status).toBe('up');
  });

  it('should return overall status degraded if database is down', async () => {
    prismaService.$queryRaw.mockRejectedValueOnce(new Error('Connection error'));
    const res = await controller.checkHealth();
    expect(res.status).toBe('degraded');
    expect(res.info.database.status).toBe('down');
  });
});
