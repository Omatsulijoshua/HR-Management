import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EssService } from './ess.service';
import { EssController } from './ess.controller';

@Module({
  imports: [PrismaModule],
  providers: [EssService],
  controllers: [EssController],
  exports: [EssService],
})
export class EssModule {}
