import { MeteoService } from '../../services/meteoService';
import { Meteo } from '../../domain/meteo';
import { Location } from '../../domain/location';

type MockMeteoRepository = {
    find: jest.Mock<Promise<Meteo>, [Location]>;
};

const createMockRepo = (): MockMeteoRepository => ({
    find: jest.fn()
});

describe('MeteoService', () => {
    let repo: MockMeteoRepository;
    let service: MeteoService;

    beforeEach(() => {
        repo = createMockRepo();
        service = new MeteoService(repo as any);
    });

    describe('listMeteo', () => {
        it('returns weather for a location', async () => {
            const location: Location = {
                name: 'Paris, France',
                longitude: 2.35,
                latitude: 48.85
            };

            const meteo: Meteo = {
                location,
                previsions: [
                    {
                        date: new Date('2026-09-18T10:00:00'),
                        shortwaveRadiation: 250
                    },
                    {
                        date: new Date('2026-09-18T11:00:00'),
                        shortwaveRadiation: 420
                    }
                ]
            };

            repo.find.mockResolvedValue(meteo);

            const result = await service.listMeteo(location);

            expect(result).toEqual(meteo);
            expect(repo.find).toHaveBeenCalledTimes(1);
            expect(repo.find).toHaveBeenCalledWith(location);
        });

        it('passes the selected location to the repository', async () => {
            const location: Location = {
                name: 'Alès, Gard, Occitanie, France',
                longitude: 4.08357,
                latitude: 44.12489
            };

            const meteo: Meteo = {
                location,
                previsions: []
            };

            repo.find.mockResolvedValue(meteo);

            await service.listMeteo(location);

            expect(repo.find).toHaveBeenCalledWith(location);
        });
    });
});