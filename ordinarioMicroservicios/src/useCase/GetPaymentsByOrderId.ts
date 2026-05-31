import type { Payment } from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export class GetPaymentsByOrderIdUseCase {
    constructor(private paymentRepository: PaymentRepository) {}

    async execute(orderId: string): Promise<Payment[]> {
        return await this.paymentRepository.getPaymentsByOrderId(orderId);
    }
}
