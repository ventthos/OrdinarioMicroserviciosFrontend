import type { Product } from "../domain/models/Product";
import type { ProductRepository } from "../domain/repositories/ProductRepository";

export class GetProductsUseCase {
    private readonly productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(): Promise<Product[]> {
        return await this.productRepository.getProducts();
    }
}

