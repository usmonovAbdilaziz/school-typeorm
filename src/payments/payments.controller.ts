import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, Headers, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
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
  findAll() {
    return this.paymentsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
