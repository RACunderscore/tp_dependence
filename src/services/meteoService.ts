import { injectable, inject } from 'tsyringe';
import { Location } from '../domain/location';
import { Meteo } from '../domain/meteo';
import { MeteoRepositoryPort } from '../ports/driven/meteoRepositoryPort';
import { MeteoPort } from '../ports/driving/meteoPort';

@injectable()
export class MeteoService implements MeteoPort {

    constructor(
        @inject('MeteoRepositoryPort')
        private readonly repo: MeteoRepositoryPort
    ) {}

    async listMeteo(location: Location): Promise<Meteo> {
        return this.repo.find(location);
    }
}