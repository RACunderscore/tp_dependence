import { injectable, inject } from 'tsyringe';
import { Location } from '../domain/location';
import { LocationRepositoryPort } from '../ports/driven/locationRepositoryPort';
import { LocationPort } from '../ports/driving/locationPort';

@injectable()
export class LocationService implements LocationPort {

    constructor(
        @inject('LocationRepositoryPort')
        private readonly repo: LocationRepositoryPort
    ) {}

    async listLocations(name: string): Promise<Location[]> {
        return this.repo.find(name);
    }
}