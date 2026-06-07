import { useState, useMemo, useCallback } from "react";
import type { Order } from "../../domain/models/Order";
import type { Payment } from "../../domain/models/Payment";
import { GetOrderByIdUseCase } from "../../useCase/GetOrderById";
import { GetAllOrdersUseCase } from "../../useCase/GetAllOrders";
import { CreateOrderUseCase } from "../../useCase/CreateOrder";
import { GetPaymentsByOrderIdUseCase } from "../../useCase/GetPaymentsByOrderId";
import { ProcessPaymentUseCase } from "../../useCase/ProcessPayment";
import { ApiOrderRepository } from "../../adapter/repositories/ApiOrderRepository";
import { ApiPaymentRepository } from "../../adapter/repositories/ApiPaymentRepository";

export const useOrderViewModel = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingPayments, setLoadingPayments] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);

    const orderRepository = useMemo(() => new ApiOrderRepository(), []);
    const paymentRepository = useMemo(() => new ApiPaymentRepository(), []);
    
    const getOrderByIdUseCase = useMemo(() => new GetOrderByIdUseCase(orderRepository), [orderRepository]);
    const getAllOrdersUseCase = useMemo(() => new GetAllOrdersUseCase(orderRepository), [orderRepository]);
    const createOrderUseCase = useMemo(() => new CreateOrderUseCase(orderRepository), [orderRepository]);
    const getPaymentsByOrderIdUseCase = useMemo(() => new GetPaymentsByOrderIdUseCase(paymentRepository), [paymentRepository]);
    const processPaymentUseCase = useMemo(() => new ProcessPaymentUseCase(paymentRepository), [paymentRepository]);

    const fetchPayments = useCallback(async (orderId: string) => {
        setLoadingPayments(true);
        try {
            const data = await getPaymentsByOrderIdUseCase.execute(orderId);
            setPayments(data);
        } catch (err: any) {
            console.error("Error al obtener pagos:", err);
            
        } finally {
            setLoadingPayments(false);
        }
    }, [getPaymentsByOrderIdUseCase]);

    const searchOrder = useCallback(async (id: string) => {
        if (!id.trim()) {
            setError("Por favor, ingrese un ID de orden");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const data = await getOrderByIdUseCase.execute(id);
            setOrder(data);
            await fetchPayments(id);
        } catch (err: any) {
            setError(err.message || "Error al buscar la orden");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getOrderByIdUseCase, fetchPayments]);

    const processPayment = useCallback(async (paymentData: { ordenId: string, amount: number, paymentMethod: string }): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await processPaymentUseCase.execute(paymentData);
            // Refresh payments and order (to see updated status/debt if applicable)
            await searchOrder(paymentData.ordenId);
            return true;
        } catch (err: any) {
            setError(err.message || "Error al procesar el pago");
            return false;
        } finally {
            setLoading(false);
        }
    }, [processPaymentUseCase, searchOrder]);

    const fetchAllOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAllOrdersUseCase.execute();
            // The API returns orders in ascending order, so we reverse them to show newest first
            setOrders([...data].reverse());
        } catch (err: any) {
            setError(err.message || "Error al obtener las órdenes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getAllOrdersUseCase]);

    const createOrder = useCallback(async (newOrder: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }): Promise<boolean> => {
        setLoading(true);
        setCreateError(null);

        try {
            const createdOrder = await createOrderUseCase.execute(newOrder);
            setOrders(prev => [createdOrder, ...prev]);
            return true;
        } catch (err: any) {
            const errorMsg = err.message || "Error al crear la orden";
            setCreateError(errorMsg);
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [createOrderUseCase]);

    return {
        order,
        orders,
        payments,
        loading,
        loadingPayments,
        error,
        createError,
        searchOrder,
        fetchAllOrders,
        createOrder,
        fetchPayments,
        processPayment,
        clearOrder: useCallback(() => {
            setOrder(null);
            setPayments([]);
        }, []),
        setError
    };
};
