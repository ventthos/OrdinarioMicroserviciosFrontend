import type { Payment } from "../../domain/models/Payment";
import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiPaymentRepository implements PaymentRepository {
    private readonly apiUrl = "http://localhost:8085/pagos";

    async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
        const response = await fetch(`${this.apiUrl}/orden/${orderId}`);
        const result: ApiResponse<Payment[] | null> = await response.json();

        if (result.status === "ERROR") {
            if (result.message.includes("No se encontraron pagos")) {
                return [];
            }
            throw new Error(result.message || "Error al recuperar los pagos");
        }

        return result.data || [];
    }

    async processPayment(paymentData: { ordenId: string; amount: number; paymentMethod: string; }): Promise<Payment> {
        const response = await fetch(`${this.apiUrl}/procesar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const result: ApiResponse<Payment | null> = await response.json();

        if (result.status === "ERROR") {
            throw new Error(result.message || "Error al procesar el pago");
        }

        if (!result.data) {
            throw new Error("Respuesta del servidor vacía");
        }

        return result.data;
    }
}
