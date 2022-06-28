import { Application } from 'express';
import { EndpointsHandler } from './lib/EndpointsHandler';
import server from './server';

export class App {

    public readonly server: Application;

    constructor () {

        this.server = server;

        this.init();

    }

    private async init (): Promise<void> {

        new EndpointsHandler(this.server);

    }

}

export default new App();