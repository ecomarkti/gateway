import { Controller } from '@nestjs/common';
import { DataBankService } from './data-bank.service';

@Controller('data-bank')
export class DataBankController {
  constructor(private readonly dataBankService: DataBankService) {}
}
