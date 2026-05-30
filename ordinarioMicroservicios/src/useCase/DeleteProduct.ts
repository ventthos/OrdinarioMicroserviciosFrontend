import type { ProductRepository } from "../domain/repositories/ProductRepository";

export class DeleteProductUseCase {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async execute(id: string): Promise<void> {
        return await this.productRepository.deleteProduct(id);
    }
}
