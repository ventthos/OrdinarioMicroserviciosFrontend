export interface Payment {
    id: string;
    ordenId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionDate: string;
}
