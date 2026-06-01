import type { Order } from "../../domain/models/Order";
import type { OrderRepository } from "../../domain/repositories/OrderRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiOrderRepository implements OrderRepository {
    private readonly apiUrl = "http://localhost:8085/ordenes";

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok && response.status !== 202) {
            // Handle HTTP errors like 503, 500, 404
            let errorMsg = `Error del servidor: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch {
                // If not JSON, use default status text
            }
            throw new Error(errorMsg);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.status === "PENDING" || response.status === 202) {
            const pendingError = new Error(result.message || "Operación de orden aceptada y pendiente de procesamiento");
            (pendingError as any).isPending = true;
            throw pendingError;
        }

        if (result.status === "ERROR") {
            throw new Error(result.message || "Operación fallida en el servidor");
        }

        if (result.data === undefined || result.data === null) {
            // For methods that expect data (like create or getById)
            // Note: getAll might return empty array which is fine, but create should return the object
            return result.data as T;
        }

        return result.data;
    }

    async getOrderById(id: string): Promise<Order> {
        const response = await fetch(`${this.apiUrl}/${id}`);
        const data = await this.handleResponse<Order | null>(response);
        if (!data) throw new Error("La orden solicitada no existe");
        return data;
    }

    async getAllOrders(): Promise<Order[]> {
        const response = await fetch(this.apiUrl);
        const data = await this.handleResponse<Order[]>(response);
        return data || [];
    }

    async createOrder(order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<Order> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        const data = await this.handleResponse<Order>(response);
        if (!data) throw new Error("El servidor no devolvió los datos de la orden creada");
        return data;
    }
}
