import type { Product } from "../../domain/models/Product";
import type { ProductRepository } from "../../domain/repositories/ProductRepository";
import type { ApiResponse, ProductDTO } from "../dto/ProductDTO";

export class ApiProductRepository implements ProductRepository {
    private readonly apiUrl = "http://localhost:8085/productos";

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok && response.status !== 202) {
            let errorMsg = `Error del servidor: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch { /* use default status */ }
            throw new Error(errorMsg);
        }

        const result: ApiResponse<T> = await response.json();
        
        if (result.status === "PENDING" || response.status === 202) {
            // Throw a specific error object that the ViewModel can identify as PENDING
            const pendingError = new Error(result.message || "Operación aceptada y pendiente de procesamiento");
            (pendingError as any).isPending = true;
            throw pendingError;
        }

        if (result.status !== "SUCCESS") {
            throw new Error(result.message || "Operación fallida");
        }

        if (result.data === undefined || result.data === null) {
            return result.data as T;
        }

        return result.data;
    }

    async getProducts(): Promise<Product[]> {
        const response = await fetch(this.apiUrl);
        const data = await this.handleResponse<ProductDTO[]>(response);
        
        return (data || []).map(dto => ({
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
        await this.handleResponse<null>(response);
    }

    async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        const data = await this.handleResponse<Product>(response);
        if (!data) throw new Error("El servidor no devolvió los datos del producto creado");
        return data;
    }
}
