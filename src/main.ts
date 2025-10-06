import { HttpExceptionFilter } from './exeptions/http-filter.exeptions';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

const PORT = process.env.PORT!;

// Asinxron bootstrap funksiyasi — NestJS ilovasini ishga tushiradi
async function bootstrap() {
  // NestJS ilovasini yaratadi va AppModule orqali konfiguratsiya qiladi
  const app = await NestFactory.create(AppModule);

  // 💳 Payment uchun webhook endpoint — Stripe yoki boshqa to‘lov tizimlari uchun xom JSON formatda qabul qilinadi
  app.use(
    '/api/v1/payments/webhook',
    express.raw({ type: 'application/json' }),
  );
  // 🔓 CORS (Cross-Origin Resource Sharing) ni yoqadi — frontend backendga har qanday domen orqali murojaat qilishi mumkin
  app.enableCors({
    origin: '*', // barcha domenlarga ruxsat
  });

  // 📁 Barcha endpointlar uchun umumiy prefix — API versiyasini belgilaydi
  app.setGlobalPrefix('api/v1');

  // ✅ Global validatsiya — DTO orqali kelgan ma’lumotlarni tekshiradi
  app.useGlobalPipes(new ValidationPipe());

  // ⚠️ Global xatolik filtri — HttpExceptionlarni tutib, foydalanuvchiga toza javob qaytaradi
  app.useGlobalFilters(new HttpExceptionFilter());

  // 🚀 Serverni belgilangan portda ishga tushiradi va konsolga log chiqaradi
  await app.listen(PORT, () => console.log('Server running on port ', PORT));
}

// 📌 Bootstrap funksiyasini chaqirish — ilovani ishga tushirish
bootstrap();
