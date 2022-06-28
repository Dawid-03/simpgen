import express from 'express';
import fileUpload from 'express-fileupload';

const app = express();

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 8 * 1024 * 1024 },
    limitHandler: (_req, res) => { res.status(401).json({ message: 'MAX_FILE_SIZE_IS_8MB' }); }
}));
app.use(express.urlencoded({ extended: false }));

app.listen(5000, () => console.log('Listening on 5000 port.')).on('error', console.error);
export default app;