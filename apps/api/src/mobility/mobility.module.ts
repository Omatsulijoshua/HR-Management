import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MobilityService } from './mobility.service';
import { MobilityController } from './mobility.controller';

@Module({
  imports: [PrismaModule],
  providers: [MobilityService],
  controllers: [MobilityController],
  exports: [MobilityService],
})
export class MobilityModule {}
