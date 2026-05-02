import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Form } from "../forms/form.entity";
import { PdfModule } from "../pdf/pdf.module";
import { AiModule } from "../ai/ai.module";
import { EmailModule } from "../email/email.module";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";

@Module({
  imports: [TypeOrmModule.forFeature([Form]), PdfModule, AiModule, EmailModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
