import type { Order } from "../models/Order";

export interface OrderRepository {
    getOrderById(id: string): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
    createOrder(order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<Order>;
}
