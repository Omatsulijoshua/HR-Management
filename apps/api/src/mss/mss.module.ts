import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MssService } from './mss.service';
import { MssController } from './mss.controller';

@Module({
  imports: [PrismaModule],
  providers: [MssService],
  controllers: [MssController],
  exports: [MssService],
})
export class MssModule {}
