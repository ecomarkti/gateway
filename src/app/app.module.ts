import { Module } from '@nestjs/common';
import { DataBankModule } from './data-bank/data-bank.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DataBankModule, UserModule]
})
export class AppModule {}
