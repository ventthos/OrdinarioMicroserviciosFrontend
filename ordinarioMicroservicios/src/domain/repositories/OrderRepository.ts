import type { Order } from "../models/Order";

export interface OrderRepository {
    getOrderById(id: string): Promise<Order>;
}
