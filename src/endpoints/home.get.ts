import { Endpoint } from '../lib/EndpointsHandler';

export default {

    name: ['/', '/home', '/generator'],
    method: 'GET',

    execute: async (req, res) => {

        res.render('generator');

    }

} as Endpoint;