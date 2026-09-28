import { Express, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { MeteoServiceFactory } from "../../services/meteoServiceFactory";

@injectable()
export class MeteoController {
    constructor(
        @inject("MeteoServiceFactory")
        private readonly serviceFactory: MeteoServiceFactory
    ) {}

    registerRoutes(app: Express): void {
        app.get(
            "/meteo/:name/:demo",
            this.getMeteoFromLocation.bind(this)
        );
    }

    async getMeteoFromLocation(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const name = req.params.name;
            const demo = req.params.demo === "true";

            const {
                locationService,
                meteoService,
            } = this.serviceFactory.create(demo);

            const locations = await locationService.listLocations(name);

            if (locations.length === 0) {
                res.status(404).json({
                    error: `Location not found: ${name}`,
                });
                return;
            }

            const location = locations[0];

            const meteo = await meteoService.listMeteo(location);

            res.json(meteo);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Unable to retrieve weather data",
            });
        }
    }
}
