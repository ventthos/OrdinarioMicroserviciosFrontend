import { useState, useMemo, useCallback } from "react";
import type { Product } from "../../domain/models/Product";
import { GetProductsUseCase } from "../../useCase/GetProducts";
import { DeleteProductUseCase } from "../../useCase/DeleteProduct";
import { CreateProductUseCase } from "../../useCase/CreateProduct";
import { ApiProductRepository } from "../../adapter/repositories/ApiProductRepository";

export const useProductViewModel = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Custom modal state
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'success' | 'info' | 'warning';
        onConfirm: () => void;
        hideCancel?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => {}
    });

    const productRepository = useMemo(() => new ApiProductRepository(), []);
    const getProductsUseCase = useMemo(() => new GetProductsUseCase(productRepository), [productRepository]);
    const deleteProductUseCase = useMemo(() => new DeleteProductUseCase(productRepository), [productRepository]);
    const createProductUseCase = useMemo(() => new CreateProductUseCase(productRepository), [productRepository]);

    const showModal = useCallback((
        title: string, 
        message: string, 
        type: 'danger' | 'success' | 'info' | 'warning', 
        onConfirm: () => void = () => closeModal(),
        hideCancel: boolean = false
    ) => {
        setModalConfig({ isOpen: true, title, message, type, onConfirm, hideCancel });
    }, []);

    const closeModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    const fetchProducts = useCallback(async () => {
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
    }, [getProductsUseCase]);

    const deleteProduct = useCallback(async (id: string) => {
        showModal(
            "CONFIRMAR ELIMINACIÓN",
            "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
            "danger",
            async () => {
                setLoading(true); // Show loading while deleting
                closeModal();
                try {
                    await deleteProductUseCase.execute(id);
                    setProducts(prev => prev.filter(p => p.id !== id));
                    showModal("ÉXITO", "Producto eliminado correctamente.", "success", () => closeModal(), true);
                } catch (err: any) {
                    const errorMessage = err.message || "Error al eliminar el producto";
                    showModal("ERROR", errorMessage, "danger", () => closeModal(), true);
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        );
    }, [showModal, closeModal, deleteProductUseCase]);

    const createProduct = useCallback(async (product: Omit<Product, 'id'>) => {
        try {
            const newProduct = await createProductUseCase.execute(product);
            setProducts(prev => [...prev, newProduct]);
            showModal("ÉXITO", "¡Producto creado correctamente!", "success", () => closeModal(), true);
            return true;
        } catch (err: any) {
            if (err.isPending) {
                showModal("PROCESANDO", err.message, "warning", () => closeModal(), true);
                return true; // Return true because it was accepted
            }
            const errorMessage = err.message || "Error al crear el producto";
            showModal("ERROR", errorMessage, "danger", () => closeModal(), true);
            console.error(err);
            return false;
        }
    }, [showModal, closeModal, createProductUseCase]);

    return {
        products,
        loading,
        error,
        deleteProduct,
        createProduct,
        refreshProducts: fetchProducts,
        modalConfig,
        closeModal,
        showNotification: (title: string, message: string, type: 'danger' | 'success' | 'info') => showModal(title, message, type)
    };
};
