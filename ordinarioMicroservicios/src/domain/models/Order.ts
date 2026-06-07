export interface OrderProduct {
    productId: string;
    name?: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderCode: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    user: string;
    debt?: number;
    products: OrderProduct[];
}
