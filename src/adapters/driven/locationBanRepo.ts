import { Location, BanResponse } from "../../domain/location";
import { LocationRepositoryPort } from "../../ports/driven/locationRepositoryPort";

export class LocationBanRepo implements LocationRepositoryPort {

    async find(name: string): Promise<Location[]> {
        const query = name.trim();

        if (!query) {
            return [];
        }

        const url = new URL(
            "https://data.geopf.fr/geocodage/search"
        );

        url.searchParams.set("q", query);
        url.searchParams.set("limit", "1");

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `BAN request failed: ${response.status} ${response.statusText}`
            );
        }

        const data: BanResponse = await response.json();

        return data.features
            .map((result): Location => ({
                name: result.properties.label,
                longitude: result.geometry.coordinates[0],
                latitude: result.geometry.coordinates[1],
            }))
            .filter(
                (location) =>
                    Number.isFinite(location.longitude) &&
                    Number.isFinite(location.latitude)
            );
    }
}