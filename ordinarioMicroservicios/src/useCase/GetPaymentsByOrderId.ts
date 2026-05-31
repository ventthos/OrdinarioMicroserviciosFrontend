import type { Payment } from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export class GetPaymentsByOrderIdUseCase {
    private readonly paymentRepository: PaymentRepository;

    constructor(paymentRepository: PaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async execute(orderId: string): Promise<Payment[]> {
        return await this.paymentRepository.getPaymentsByOrderId(orderId);
    }
}
