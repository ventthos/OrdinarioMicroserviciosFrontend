import type { Shipment } from "../../domain/models/Shipment";
import type { ShipmentRepository } from "../../domain/repositories/ShipmentRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiShipmentRepository implements ShipmentRepository {
    private readonly apiUrl = "http://localhost:8085/envios";

    async getAllShipments(): Promise<Shipment[]> {
        const response = await fetch(this.apiUrl);
        const result: ApiResponse<Shipment[]> = await response.json();

        if (result.status === "ERROR") {
            throw new Error(result.message || "Error al recuperar los envíos");
        }

        return result.data || [];
    }
}
