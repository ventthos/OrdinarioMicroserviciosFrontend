import type { Order } from "../domain/models/Order";
import type { OrderRepository } from "../domain/repositories/OrderRepository";

export class GetAllOrdersUseCase {
    private readonly orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(): Promise<Order[]> {
        return await this.orderRepository.getAllOrders();
    }
}
