import { Request, Response, Application } from 'express';
import { readdirSync } from 'fs';

export interface Endpoint {

    name: string | string[];
    method: 'GET' | 'POST';
    execute: (req: Request, res: Response) => Promise<unknown>;

}

export class EndpointsHandler {

    private readonly app: Application;

    constructor (app: Application) {

        this.app = app;

        readdirSync(`${__dirname}/../endpoints/`)
            .filter(f => f.endsWith('.js'))
            .filter(f => !f.startsWith('#'))
            .forEach(async fileName => {

                const endpoint: Endpoint = (await import(`${__dirname}/../endpoints/${fileName}`)).default;

                if (!endpoint || !endpoint.method || !endpoint.name || !endpoint.execute) return console.log('Error loading ' + fileName);

                if (typeof endpoint.name === 'string') {

                    console.log(`Loaded ${endpoint.name} endpoint`);

                    return this.addEndpoint(endpoint);

                }
                else if (Array.isArray(endpoint.name)) return endpoint.name.forEach(e => {

                    this.addEndpoint({ execute: endpoint.execute, name: e, method: endpoint.method });

                });

            });

        console.log('Succefully loaded endpoints.');

    }

    private async addEndpoint (endpoint: Endpoint): Promise<void> {

        this.app[endpoint.method.toLowerCase()](endpoint.name, (req: Request, res: Response) => endpoint.execute(req, res));

    }

}