import type { Product } from "../../domain/models/Product";
import type { ProductRepository } from "../../domain/repositories/ProductRepository";
import type { ApiResponse, ProductDTO } from "../dto/ProductDTO";

export class ApiProductRepository implements ProductRepository {
    private readonly apiUrl = "http://localhost:8085/productos";

    async getProducts(): Promise<Product[]> {
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
            throw new Error("Error al obtener los productos");
        }
        const result: ApiResponse<ProductDTO[]> = await response.json();
        
        if (result.status !== "SUCCESS") {
            throw new Error(result.message || "Error al obtener los productos");
        }

        return result.data.map(dto => ({
            id: dto.id,
            name: dto.name,
            description: dto.description,
            price: dto.price,
            quantity: dto.quantity,
            imageUrl: dto.imageUrl,
            supplier: dto.supplier
        }));
    }

    async deleteProduct(id: string): Promise<void> {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Error al eliminar el producto");
        }
    }
}
