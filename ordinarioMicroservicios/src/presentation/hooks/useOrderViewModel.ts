import { useState, useMemo } from "react";
import type { Order } from "../../domain/models/Order";
import { GetOrderByIdUseCase } from "../../useCase/GetOrderById";
import { GetAllOrdersUseCase } from "../../useCase/GetAllOrders";
import { CreateOrderUseCase } from "../../useCase/CreateOrder";
import { ApiOrderRepository } from "../../adapter/repositories/ApiOrderRepository";

export const useOrderViewModel = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const orderRepository = useMemo(() => new ApiOrderRepository(), []);
    const getOrderByIdUseCase = useMemo(() => new GetOrderByIdUseCase(orderRepository), [orderRepository]);
    const getAllOrdersUseCase = useMemo(() => new GetAllOrdersUseCase(orderRepository), [orderRepository]);
    const createOrderUseCase = useMemo(() => new CreateOrderUseCase(orderRepository), [orderRepository]);

    const searchOrder = async (id: string) => {
        if (!id.trim()) {
            setError("Por favor, ingrese un ID de orden");
            return;
        }

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const data = await getOrderByIdUseCase.execute(id);
            setOrder(data);
        } catch (err: any) {
            setError(err.message || "Error al buscar la orden");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAllOrdersUseCase.execute();
            setOrders(data);
        } catch (err: any) {
            setError(err.message || "Error al obtener las órdenes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (newOrder: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const createdOrder = await createOrderUseCase.execute(newOrder);
            setOrders(prev => [createdOrder, ...prev]);
            return true;
        } catch (err: any) {
            setError(err.message || "Error al crear la orden");
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        order,
        orders,
        loading,
        error,
        searchOrder,
        fetchAllOrders,
        createOrder,
        clearOrder: () => setOrder(null),
        setError
    };
};
