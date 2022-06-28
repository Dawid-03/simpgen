import { Endpoint } from '../lib/EndpointsHandler';
import Generate from '../lib/Generate';
import { Options } from '../types/Options';

export default {

    name: '/api/v1/generate',
    method: 'POST',

    execute: async (req, res) => {

        const body: Options = req.body;


        if (!body.birthDate || !body.caption || !body.desiredObject || !body.lives || !body.name/* || !body.photo*/) return;

        Object.values(body).forEach((field: string, i: number) => {

            if (typeof field !== 'string') return;

            field = field.replace(/\r?\n/g, ' ');

            body[Object.keys(body)[i]] = field;

        });


        const { photo, name, lives, desiredObject, caption, birthDate } = body;

        const gen = new Generate({
            birthDate,
            caption,
            desiredObject,
            lives,
            name,
            photo
        });

        gen.generate();

        gen.on('ready', () => console.log('Rendering ready.'));

        res.json(200);

    }

} as Endpoint;