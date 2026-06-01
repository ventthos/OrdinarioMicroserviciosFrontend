import type { Payment } from "../../domain/models/Payment";
import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiPaymentRepository implements PaymentRepository {
    private readonly apiUrl = "http://localhost:8085/pagos";

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok && response.status !== 202) {
            let errorMsg = `Error del servidor: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch { /* use default status */ }
            throw new Error(errorMsg);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.status === "PENDING" || response.status === 202) {
            const pendingError = new Error(result.message || "Procesamiento de pago aceptado y pendiente");
            (pendingError as any).isPending = true;
            throw pendingError;
        }

        if (result.status === "ERROR") {
            // Special case for getPayments where "no payments" is reported as error
            if (result.message?.includes("No se encontraron pagos")) {
                return [] as unknown as T;
            }
            throw new Error(result.message || "Error en el servidor de pagos");
        }

        return result.data as T;
    }

    async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
        const response = await fetch(`${this.apiUrl}/orden/${orderId}`);
        const data = await this.handleResponse<Payment[] | null>(response);
        return data || [];
    }

    async processPayment(paymentData: { ordenId: string; amount: number; paymentMethod: string; }): Promise<Payment> {
        const response = await fetch(`${this.apiUrl}/procesar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        const data = await this.handleResponse<Payment>(response);
        if (!data) throw new Error("El servidor no devolvió los datos del pago procesado");
        return data;
    }
}
