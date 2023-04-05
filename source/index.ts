import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import {decrypt} from './modules/decrypt';
import {unzip} from './modules/unzip';
import {parser} from './modules/parser';

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

(async () => {

    const server = https.createServer(options, (req, res) => {

        switch (req.url) {
            case '/decrypt':

                decrypt(IV_FILE, AUTH_FILE, PW_FILE, ENC_FILE, DEC_FILE).then(() => {
                    res.writeHead(200);
                    res.end('Decrypted');
                });

                break;

            case '/unzip':

                unzip(DEC_FILE, UNZIP_FILE).then(() => {
                    res.writeHead(200);
                    res.end('Unzipped');
                });

                break;

            case '/parse':

                parser(UNZIP_FILE).then((result) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(result));
                });

                break;
        }

    });

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });

})();
