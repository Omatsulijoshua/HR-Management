import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SuccessionService } from './succession.service';
import { SuccessionController } from './succession.controller';

@Module({
  imports: [PrismaModule],
  providers: [SuccessionService],
  controllers: [SuccessionController],
  exports: [SuccessionService],
})
export class SuccessionModule {}
