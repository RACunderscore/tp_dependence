import 'reflect-metadata';
import dotenv from 'dotenv';

import { container } from 'tsyringe';

import { LocationRepo } from '../adapters/driven/locationRepo';
import { LocationBanRepo } from '../adapters/driven/locationBanRepo';

import { MeteoRepo } from '../adapters/driven/meteoRepo';
import { MeteoMetRepo } from '../adapters/driven/meteoMetRepo';

dotenv.config({
    quiet: true,
});

const locationProvider = process.env.LOCATION_PROVIDER || 'BAN';
const meteoProvider = process.env.METEO_PROVIDER || 'OPEN_METEO';

// Location
if (locationProvider === 'BAN') {
    container.register('LocationRepositoryPort', {
        useClass: LocationBanRepo,
    });
} else if (locationProvider === 'NOMINATIM') {
    container.register('LocationRepositoryPort', {
        useClass: LocationRepo,
    });
} else {
    throw new Error(
        `Unknown LOCATION_PROVIDER: ${locationProvider}`
    );
}

// Meteo
if (meteoProvider === 'MET_NORWAY') {
    container.register('MeteoRepositoryPort', {
        useClass: MeteoMetRepo,
    });
} else if (meteoProvider === 'OPEN_METEO') {
    container.register('MeteoRepositoryPort', {
        useClass: MeteoRepo,
    });
} else {
    throw new Error(
        `Unknown METEO_PROVIDER: ${meteoProvider}`
    );
}

export { container };