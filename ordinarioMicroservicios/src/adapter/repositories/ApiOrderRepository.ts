import type { Order } from "../../domain/models/Order";
import type { OrderRepository } from "../../domain/repositories/OrderRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiOrderRepository implements OrderRepository {
    private readonly apiUrl = "http://localhost:8085/ordenes";

    async getOrderById(id: string): Promise<Order> {
        const response = await fetch(`${this.apiUrl}/${id}`);
        const result: ApiResponse<Order | null> = await response.json();

        if (result.status === "ERROR" || !result.data) {
            throw new Error(result.message || "No se pudo recuperar la orden");
        }

        return result.data;
    }
}
