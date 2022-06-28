import EventEmitter from 'events';
import { Options } from '../types/Options';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { appendFileSync, readFileSync, unlinkSync } from 'fs';
import dayjs from 'dayjs';

registerFont('./assets/Inkfree.ttf', { family: 'Link Free' });
registerFont('./assets/BAHNSCHRIFT.TTF', { family: 'Bahnschrift' });


export default class Generator extends EventEmitter {

    public readonly name: string;
    public readonly photo: Buffer;
    public readonly birthDate: string;
    public readonly lives: string;
    public readonly desiredObject: string;
    public readonly caption: string;

    constructor (options: Options) {

        super();

        this.name = options['name'];
        this.photo = options['photo'];
        this.birthDate = options['birthDate'];
        this.lives = options['lives'];
        this.desiredObject = options['desiredObject'];
        this.caption = options['caption'];

        // this.generate();

    }

    public async generate (): Promise<Buffer> {

        unlinkSync('./assets/generated/simpcard.png');

        const canvas = createCanvas(960, 540);
        let ctx = canvas.getContext('2d');

        const template = await loadImage('./assets/simpcard-template.png');

        ctx.drawImage(template, 0, 0, 960, 540);

        /*
         * Podpis posiadacza karty
         */

        ctx.fillStyle = '#00000';
        ctx.font = '45px "Link Free"';
        ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        ctx.fillText(this.caption, 650, 240, 510);
        ctx.save();

        /*
         * Data urodzenia
         */

        ctx.font = '25px "Link Free"';
        ctx.fillText(this.birthDate, 610, 305, 160);
        ctx.save();

        /*
         * Imię i nazwisko
         */

        ctx.font = '20px "Link Free"';
        ctx.fillText(this.name, 610, 340, 160);
        ctx.save();

        /*
         * Zamieszkały w
         */

        ctx.font = '25px "Link Free"';
        ctx.fillText(this.lives, 610, 371, 160);
        ctx.save();

        /*
         * Obiekt porządany
         */

        ctx.font = '20px "Link Free"';
        ctx.fillText(this.desiredObject, 800, 340, 160);
        ctx.save();

        /*
         * Data wydania 
         */

        ctx.font = '16px "Bahnschrift"';
        ctx.fillText(dayjs().format('DD.MM.YYYYr.'), 205, 500);
        ctx.save();

        /*
         * Data ważności
         */

        ctx.font = '16px "Bahnschrift"';
        ctx.fillText(`${dayjs().format('DD.MM')}.${~~(new Date().getFullYear() + 1)}r.`, 430, 500);
        ctx.save();

        /*
         * Zdjęcie
         */

        ctx.restore();
        const avatar = await loadImage(Buffer.from(readFileSync('./assets/avatar.jpeg')));


        ctx = await this.roundRect(ctx, 50, 65, 300, 410, 50);

        ctx.clip();
        ctx.fill();

        ctx.drawImage(avatar, 50, 65, 300, 410);

        appendFileSync('./assets/generated/simpcard.png', canvas.toBuffer());

        super.emit('ready');

        return canvas.toBuffer();
    }

    private async roundRect (ctx: any, x: number, y: number, width: number, height: number, radius: number) {

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        return ctx;

    }

}