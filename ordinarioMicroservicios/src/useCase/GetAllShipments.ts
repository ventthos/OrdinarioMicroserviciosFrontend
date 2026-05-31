import type { Shipment } from "../domain/models/Shipment";
import type { ShipmentRepository } from "../domain/repositories/ShipmentRepository";

export class GetAllShipmentsUseCase {
    private readonly shipmentRepository: ShipmentRepository;

    constructor(shipmentRepository: ShipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    async execute(): Promise<Shipment[]> {
        return await this.shipmentRepository.getAllShipments();
    }
}
