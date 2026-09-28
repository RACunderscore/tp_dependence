import { Location } from "../../domain/location";
import { LocationRepositoryPort } from "../../ports/driven/locationRepositoryPort";

export class LocationDemoRepo implements LocationRepositoryPort {
    async find(name: string): Promise<Location[]> {
        return [
            {
                name: name || "Alès",
                longitude: 4.089242,
                latitude: 44.125356,
            },
        ];
    }
}
