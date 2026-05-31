import type { Payment } from "../models/Payment";

export interface PaymentRepository {
    getPaymentsByOrderId(orderId: string): Promise<Payment[]>;
    processPayment(paymentData: { ordenId: string, amount: number, paymentMethod: string }): Promise<Payment>;
}
