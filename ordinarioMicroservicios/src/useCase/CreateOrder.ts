import type { Order } from "../domain/models/Order";
import type { OrderRepository } from "../domain/repositories/OrderRepository";

export class CreateOrderUseCase {
    private readonly orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<Order> {
        return await this.orderRepository.createOrder(order);
    }
}
