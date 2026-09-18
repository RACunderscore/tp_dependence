import { Location, NominatimResult } from "../../domain/location";
import { LocationRepositoryPort } from "../../ports/driven/locationRepositoryPort";

export class LocationRepo implements LocationRepositoryPort {
  async find(name: string): Promise<Location[]> {
    const query = name.trim();

    if (!query) {
      return [];
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "10");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "tp1ApiMeteo/1.0 (thomas.humbert@etu.mines-ales.fr)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Nominatim request failed: ${response.status} ${response.statusText}`,
      );
    }

    const results: NominatimResult[] = await response.json();

    return results
      .map((result): Location => ({
        name: result.display_name,
        longitude: Number(result.lon),
        latitude: Number(result.lat),
      }))
      .filter(
        (location) =>
          Number.isFinite(location.longitude) &&
          Number.isFinite(location.latitude),
      );
  }
}
