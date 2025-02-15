import { Module } from '@nestjs/common';
import { DataBankService } from './data-bank.service';
import { DataBankController } from './data-bank.controller';

@Module({
  controllers: [DataBankController],
  providers: [DataBankService],
})
export class DataBankModule {}
