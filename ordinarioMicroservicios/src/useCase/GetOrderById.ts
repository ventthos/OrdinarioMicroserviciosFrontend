import type { Order } from "../domain/models/Order";
import type { OrderRepository } from "../domain/repositories/OrderRepository";

export class GetOrderByIdUseCase {
    private readonly orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(id: string): Promise<Order> {
        return await this.orderRepository.getOrderById(id);
    }
}
