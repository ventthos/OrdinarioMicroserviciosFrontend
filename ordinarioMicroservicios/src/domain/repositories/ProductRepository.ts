import type { Product } from "../models/Product";

export interface ProductRepository {
    getProducts(): Promise<Product[]>;
    deleteProduct(id: string): Promise<void>;
}
