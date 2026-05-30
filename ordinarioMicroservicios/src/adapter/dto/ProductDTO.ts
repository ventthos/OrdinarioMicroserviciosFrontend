export interface ProductDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageUrl: string;
    supplier: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}
