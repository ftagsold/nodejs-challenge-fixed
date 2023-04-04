import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import {decrypt} from './modules/decrypt';
import {unzip} from './modules/unzip';
import {fork, Serializable} from 'child_process';

const PORT = 3000;

const IV_FILE = '../../iv.txt';
const AUTH_FILE = '../../auth.txt';
const PW_FILE = '../../secret.key';
const ENC_FILE = '../../secret.enc';
const DEC_FILE = '../../secret.dec';
const UNZIP_FILE = '../../secret.txt';

const options = {
    key: fs.readFileSync(path.join(__dirname, '../localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '../localhost.crt')),
};

const getFork = <R extends Serializable>(modulePath: string, filePath: string): Promise<R> => {

    return new Promise((resolve) => {

        const child = fork(path.join(__dirname, modulePath));

        child.on('message', (response: R) => {
            resolve(response);
        });

        child.send(filePath);

    });

};

(async () => {

    await decrypt(IV_FILE, AUTH_FILE, PW_FILE, ENC_FILE, DEC_FILE);

    await unzip(DEC_FILE, UNZIP_FILE);

    const server = https.createServer(options, (req, res) => {

        return Promise.all([
            getFork<number>('./modules/sumFile', UNZIP_FILE),
            getFork<number>('./modules/sumVocals', UNZIP_FILE),
            getFork<string>('./modules/sumSentence', UNZIP_FILE)
        ]).then(([all, vocals, secret]) => {

            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.writeHead(200);
            res.end(`
                Sum numbers: ${all}
                Sum vocals: ${vocals}
                Numbers + Vocals: ${all + vocals}
                Secret: ${secret}
            `);

        });

    });

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });

})();
