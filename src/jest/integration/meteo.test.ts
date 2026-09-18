import { MeteoService } from '../../services/meteoService';
import { MeteoRepo } from '../../adapters/driven/meteoRepo';
import { Location } from '../../domain/location';
import { Meteo } from '../../domain/meteo';

describe('MeteoService - Integration', () => {
    let repo: MeteoRepo;
    let service: MeteoService;

    beforeEach(() => {
        repo = new MeteoRepo();
        service = new MeteoService(repo);
    });

    describe('listMeteo', () => {

        it('returns the weather for a location', async () => {
            const location: Location = {
                name: 'Paris, France',
                latitude: 48.85,
                longitude: 2.35
            };

            const result: Meteo = await service.listMeteo(location);

            expect(result).toBeDefined();

            expect(result.location).toEqual(location);

            expect(result.previsions).toBeDefined();
            expect(result.previsions.length).toBeGreaterThan(0);

            const prevision = result.previsions[0];

            expect(prevision.date).toBeDefined();
            expect(prevision.date).toBeInstanceOf(Date);

            expect(prevision.shortwaveRadiation).toBeDefined();
            expect(typeof prevision.shortwaveRadiation).toBe('number');
        });

        it('returns several hourly weather predictions', async () => {
            const location: Location = {
                name: 'Alès, Gard, Occitanie, France',
                latitude: 44.12489,
                longitude: 4.08357
            };

            const result = await service.listMeteo(location);

            expect(result.previsions.length).toBeGreaterThan(1);

            for (const prevision of result.previsions) {
                expect(prevision.date).toBeInstanceOf(Date);
                expect(typeof prevision.shortwaveRadiation).toBe('number');
            }
        });
    });
});