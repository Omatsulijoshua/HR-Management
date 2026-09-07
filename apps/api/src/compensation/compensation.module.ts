import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CompensationService } from './compensation.service';
import { CompensationController } from './compensation.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CompensationController],
  providers: [CompensationService],
  exports: [CompensationService],
})
export class CompensationModule {}
