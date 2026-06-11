import { useState, useMemo, useCallback } from "react";
import type { Shipment } from "../../domain/models/Shipment";
import { GetAllShipmentsUseCase } from "../../useCase/GetAllShipments";
import { ApiShipmentRepository } from "../../adapter/repositories/ApiShipmentRepository";

export const useShipmentViewModel = () => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const shipmentRepository = useMemo(() => new ApiShipmentRepository(), []);
    const getAllShipmentsUseCase = useMemo(() => new GetAllShipmentsUseCase(shipmentRepository), [shipmentRepository]);

    const fetchAllShipments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getAllShipmentsUseCase.execute();
            const sortedData = [...data].sort((a, b) => b.id - a.id);
            setShipments(sortedData);
        } catch (err: any) {
            setError(err.message || "Error al obtener los envíos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [getAllShipmentsUseCase]);

    return {
        shipments,
        loading,
        error,
        fetchAllShipments
    };
};
