import { LocationService } from '../../services/locationService';
import { Location } from '../../domain/location';

type MockLocationRepository = {
    find: jest.Mock<Promise<Location[]>, [string]>;
};

const createMockRepo = (): MockLocationRepository => ({
    find: jest.fn()
});

describe('LocationService', () => {
    let repo: MockLocationRepository;
    let service: LocationService;

    beforeEach(() => {
        repo = createMockRepo();
        service = new LocationService(repo as any);
    });

    describe('listLocations', () => {
        it('returns locations found by name', async () => {
            const locations: Location[] = [
                {
                    name: 'Alès, Gard, Occitanie, France',
                    longitude: 4.08357,
                    latitude: 44.12489
                }
            ];

            repo.find.mockResolvedValue(locations);

            const result = await service.listLocations('Alès');

            expect(result).toEqual(locations);
            expect(repo.find).toHaveBeenCalledTimes(1);
            expect(repo.find).toHaveBeenCalledWith('Alès');
        });

        it('returns an empty array when no location is found', async () => {
            repo.find.mockResolvedValue([]);

            const result = await service.listLocations('UnknownCity');

            expect(result).toEqual([]);
            expect(repo.find).toHaveBeenCalledTimes(1);
            expect(repo.find).toHaveBeenCalledWith('UnknownCity');
        });
    });
});