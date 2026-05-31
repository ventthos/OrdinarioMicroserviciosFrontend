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

    async getAllOrders(): Promise<Order[]> {
        const response = await fetch(this.apiUrl);
        const result: ApiResponse<Order[]> = await response.json();

        if (result.status === "ERROR") {
            throw new Error(result.message || "No se pudieron recuperar las órdenes");
        }

        return result.data || [];
    }

    async createOrder(order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<Order> {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        const result: ApiResponse<Order> = await response.json();

        if (result.status === "ERROR") {
            throw new Error(result.message || "Error al crear la orden");
        }

        return result.data;
    }
}
