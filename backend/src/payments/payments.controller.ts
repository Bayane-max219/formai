import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PaymentsService } from "./payments.service";

class CheckoutDto {
  formId!: string;
  type!: string;
}

class ConfirmDto {
  sessionId!: string;
  formId!: string;
}

@Controller("payments")
@UseGuards(AuthGuard("jwt"))
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post("checkout")
  checkout(@Body() dto: CheckoutDto, @Request() req: { user: { id: string } }) {
    return this.paymentsService.createCheckoutSession(dto.formId, dto.type, req.user.id);
  }

  @Post("confirm")
  confirm(@Body() dto: ConfirmDto, @Request() req: { user: { id: string } }) {
    return this.paymentsService.confirmPayment(dto.sessionId, dto.formId, req.user.id);
  }
}
