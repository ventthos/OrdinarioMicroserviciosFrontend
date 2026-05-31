import type { Payment } from "../../domain/models/Payment";
import type { PaymentRepository } from "../../domain/repositories/PaymentRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiPaymentRepository implements PaymentRepository {
    private readonly apiUrl = "http://localhost:8085/pagos/orden";

    async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
        const response = await fetch(`${this.apiUrl}/${orderId}`);
        const result: ApiResponse<Payment[] | null> = await response.json();

        if (result.status === "ERROR") {
            // According to the user, if no payments are found, it returns ERROR status.
            // We should probably return an empty array instead of throwing if it's just "not found"
            if (result.message.includes("No se encontraron pagos")) {
                return [];
            }
            throw new Error(result.message || "Error al recuperar los pagos");
        }

        return result.data || [];
    }
}
