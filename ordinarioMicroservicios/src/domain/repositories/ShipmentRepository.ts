import type { Shipment } from "../models/Shipment";

export interface ShipmentRepository {
    getAllShipments(): Promise<Shipment[]>;
}
