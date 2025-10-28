import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { BuyerService } from '../buyer/buyer.service';
import { handleError, succesMessage } from '../helpers/response';
import { BuyerStatus } from '../roles/roles';
import { CardsService } from '../cards/cards.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly cardsService: CardsService,
    private readonly buyerService: BuyerService,
  ) {}
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const { buyer_id, metadata, currency, provider, amount, card_id } =
        createPaymentDto;
      const buyer = await this.buyerService.findOne(buyer_id);
      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }
      await this.cardsService.cardsId(card_id);
      // const lots = await this.lotsService.findAll();
      // function fixPrice() {
      //   if (lots && Array.isArray(lots.data)) {
      //     let allPrice = 0;
      //     for (const lot of lots.data) {
      //       allPrice += Number(lot.starting_bit); // umumiy narx yig‘ish
      //     }
      //     return allPrice;
      //   } else {
      //     throw new NotFoundException('Lots data not found or invalid');
      //   }
      // // }
      // const amountPrice = fixPrice();
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, //jami lotlarning 50% ga tulov olish
        currency: currency.toLowerCase(),
        metadata: {
          buyer_id,
          ...metadata,
        },
        confirm: true,
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      const payment = this.paymentRepo.create({
        buyer_id,
        amount,
        provider,
        providerTransactionId: paymentIntent.id, // charge.id yoki paymentIntent.id ni saqlash
        currency,
        metadata,
      });
      await this.paymentRepo.save(payment);
      return succesMessage(payment, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async webhook(rawBody: Buffer, sig: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable is not set');
      throw new BadRequestException('Webhook configuration error');
    }

    let event;

    try {
      // ✅ Stripe eventni tekshirish
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

      const transactionId = event.data.object.id;

      if (transactionId.split('_')[0] === 'pi') {
        const payment = await this.paymentRepo.findOne({
          where: { providerTransactionId: transactionId },
        });

        if (!payment) {
          console.warn(
            `Payment with transaction ID ${transactionId} not found`,
          );
          return { received: true, warning: 'Payment not found' };
        }

        // 🎯 SUCCESS bo‘lsa — Paid, else — Cancelled
        if (
          event.type === 'payment_intent.succeeded' ||
          event.type === 'payment_intent.created'
        ) {
          // Payment statusini yangilaymiz
          await this.paymentRepo.update(payment.id, {
            buyerStatus: BuyerStatus.Paid,
          });

          // Buyer statusini yangilaymiz
          await this.buyerService.update(payment.buyer_id, {
            buyerStatus: BuyerStatus.Paid,
          });
        } else {
          await this.paymentRepo.update(payment.id, {
            buyerStatus: BuyerStatus.Cancelled,
          });

          // Buyer statusini yangilaymiz
          await this.buyerService.update(payment.buyer_id, {
            buyerStatus: BuyerStatus.Cancelled,
          });
        }

        return { received: true, eventType: event.type };
      }
      // Bazadan payment topamiz
    } catch (err: any) {
      console.error('Webhook Error:', err.message, err.stack);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  async findAll(id: string) {
    try {
      const payments = await this.paymentRepo.find({
        where: { buyer_id: id },
        relations: ['buyer'],
      });
      return succesMessage(payments);
    } catch (error) {
      handleError(error);
    }
  }
  async findOne(id: string) {
    try {
      const payment = await this.paymentRepo.findOne({
        where: { buyer_id: id },
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      return succesMessage(payment);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const payment = await this.paymentRepo.findOne({ where: { id } });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      await this.paymentRepo.remove(payment);
      return succesMessage({ message: 'Deleted payment from ID' });
    } catch (error) {
      handleError(error);
    }
  }
}
