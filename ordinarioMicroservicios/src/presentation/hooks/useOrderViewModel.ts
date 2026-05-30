import { useState, useMemo } from "react";
import type { Order } from "../../domain/models/Order";
import { GetOrderByIdUseCase } from "../../useCase/GetOrderById";
import { ApiOrderRepository } from "../../adapter/repositories/ApiOrderRepository";

export const useOrderViewModel = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const orderRepository = useMemo(() => new ApiOrderRepository(), []);
    const getOrderByIdUseCase = useMemo(() => new GetOrderByIdUseCase(orderRepository), [orderRepository]);

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

    return {
        order,
        loading,
        error,
        searchOrder,
        clearOrder: () => setOrder(null)
    };
};
