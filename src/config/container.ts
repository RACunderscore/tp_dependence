import 'reflect-metadata';
import { container } from 'tsyringe';

import { LocationRepo } from '../adapters/driven/locationRepo';
import { MeteoRepo } from '../adapters/driven/meteoRepo';

container.register('LocationRepositoryPort', {
    useClass: LocationRepo,
});

container.register('MeteoRepositoryPort', {
    useClass: MeteoRepo,
});

export { container };