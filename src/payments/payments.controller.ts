import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Req,
  Headers,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../guard/auth-guard';
import { BuyerGuard } from '../guard/buyer-guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(AuthGuard, BuyerGuard)
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleStripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') sig: string,
  ) {
    if (!sig) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    // Raw body Stripe verification uchun kerak
    const rawBody = req.body;
    if (!rawBody || !(rawBody instanceof Buffer)) {
      throw new BadRequestException('Invalid raw body for webhook');
    }

    return this.paymentsService.webhook(rawBody, sig);
  }

  @Get()
  @UseGuards(AuthGuard, BuyerGuard)
  findAll() {
    return this.paymentsService.findAll();
  }
  @Get(':id')
  @UseGuards(AuthGuard, BuyerGuard)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, BuyerGuard)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
