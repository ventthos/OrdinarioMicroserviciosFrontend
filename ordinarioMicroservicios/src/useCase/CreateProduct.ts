import type { Product } from "../domain/models/Product";
import type { ProductRepository } from "../domain/repositories/ProductRepository";

export class CreateProductUseCase {
    private readonly productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(product: Omit<Product, 'id'>): Promise<Product> {
        return await this.productRepository.createProduct(product);
    }
}
