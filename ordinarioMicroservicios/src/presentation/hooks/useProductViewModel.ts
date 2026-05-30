import { useState, useEffect, useMemo } from "react";
import type { Product } from "../../domain/models/Product";
import { GetProductsUseCase } from "../../useCase/GetProducts";
import { DeleteProductUseCase } from "../../useCase/DeleteProduct";
import { ApiProductRepository } from "../../adapter/repositories/ApiProductRepository";

export const useProductViewModel = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const productRepository = useMemo(() => new ApiProductRepository(), []);
    const getProductsUseCase = useMemo(() => new GetProductsUseCase(productRepository), [productRepository]);
    const deleteProductUseCase = useMemo(() => new DeleteProductUseCase(productRepository), [productRepository]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProductsUseCase.execute();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError("Error al cargar los productos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            await deleteProductUseCase.execute(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError("Error al eliminar el producto");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        deleteProduct,
        refreshProducts: fetchProducts
    };
};
