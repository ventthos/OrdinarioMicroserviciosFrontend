import type { Shipment } from "../../domain/models/Shipment";
import type { ShipmentRepository } from "../../domain/repositories/ShipmentRepository";
import type { ApiResponse } from "../dto/ProductDTO";

export class ApiShipmentRepository implements ShipmentRepository {
    private readonly apiUrl = "http://localhost:8085/envios";

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            let errorMsg = `Error del servidor: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch { /* use default status */ }
            throw new Error(errorMsg);
        }

        const result: ApiResponse<T> = await response.json();

        if (result.status === "ERROR") {
            throw new Error(result.message || "Error en el servidor de envíos");
        }

        return result.data as T;
    }

    async getAllShipments(): Promise<Shipment[]> {
        const response = await fetch(this.apiUrl);
        const data = await this.handleResponse<Shipment[]>(response);
        return data || [];
    }
}
