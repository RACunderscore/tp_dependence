import { Location } from "../../domain/location";
import { LocationRepositoryPort } from "../../ports/driven/locationRepositoryPort";

export class CachedLocationRepository implements LocationRepositoryPort
{
    private readonly cache = new Map<string, Promise<Location[]>>();

    constructor(
        private readonly repository: LocationRepositoryPort
    ) {}

    find(name: string): Promise<Location[]> {
        const key = name.trim().toLowerCase();

        const cached = this.cache.get(key);

        if (cached) {
            return cached;
        }

        const request = this.repository.find(name).catch((error) => {
            this.cache.delete(key);
            throw error;
        });

        this.cache.set(key, request);

        return request;
    }
}