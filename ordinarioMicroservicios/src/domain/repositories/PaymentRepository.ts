import type { Payment } from "../models/Payment";

export interface PaymentRepository {
    getPaymentsByOrderId(orderId: string): Promise<Payment[]>;
}
