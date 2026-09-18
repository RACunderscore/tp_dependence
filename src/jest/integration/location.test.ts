import { LocationService } from '../../services/locationService';
import { LocationRepo } from '../../adapters/driven/locationRepo';
import { Location } from '../../domain/location';

describe('LocationService - Integration', () => {
    let repo: LocationRepo;
    let service: LocationService;

    beforeEach(() => {
        repo = new LocationRepo();
        service = new LocationService(repo);
    });

    describe('listLocations', () => {

        it('searches for a city and returns its locations', async () => {
            const result: Location[] = await service.listLocations('Alès');

            expect(result).toBeDefined();
            expect(result.length).toBeGreaterThan(0);

            const location = result[0];

            expect(location.name).toBeDefined();
            expect(location.name.length).toBeGreaterThan(0);

            expect(location.latitude).toBeDefined();
            expect(location.longitude).toBeDefined();

            expect(typeof location.latitude).toBe('number');
            expect(typeof location.longitude).toBe('number');

            expect(location.latitude).toBeGreaterThanOrEqual(-90);
            expect(location.latitude).toBeLessThanOrEqual(90);

            expect(location.longitude).toBeGreaterThanOrEqual(-180);
            expect(location.longitude).toBeLessThanOrEqual(180);
        });

        it('returns an empty array for an unknown city', async () => {
            const result = await service.listLocations(
                'ThisCityDoesNotExist123456789'
            );

            expect(result).toBeDefined();
            expect(result).toEqual([]);
        });
    });
});