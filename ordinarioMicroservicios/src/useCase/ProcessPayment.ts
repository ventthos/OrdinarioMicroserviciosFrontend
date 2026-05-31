import type { Payment } from "../domain/models/Payment";
import type { PaymentRepository } from "../domain/repositories/PaymentRepository";

export class ProcessPaymentUseCase {
    private readonly paymentRepository: PaymentRepository;

    constructor(paymentRepository: PaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async execute(paymentData: { ordenId: string, amount: number, paymentMethod: string }): Promise<Payment> {
        if (paymentData.amount <= 0) {
            throw new Error("El monto debe ser mayor a cero");
        }
        
        if (!paymentData.paymentMethod) {
            throw new Error("Debe seleccionar un método de pago");
        }

        return await this.paymentRepository.processPayment(paymentData);
    }
}
