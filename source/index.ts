import {sumFile} from "./modules/sumFile";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import {decrypt} from "./modules/decrypt";
import {unzip} from "./modules/unzip";
import {sumBySentences} from "./modules/sumSentence";
import {sumVocals} from "./modules/sumVocals";

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

    await decrypt(IV_FILE, AUTH_FILE, PW_FILE, ENC_FILE, DEC_FILE);

    await unzip(DEC_FILE, UNZIP_FILE);

    const server = https.createServer(options, (req, res) => {

        // TODO: Handle parsing in child processes, again, time is running out :/
        return Promise.all([
            sumFile(UNZIP_FILE),
            sumVocals(UNZIP_FILE),
            sumBySentences(UNZIP_FILE)
        ]).then(([all, vocals, secret]) => {

            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.writeHead(200);
            res.end(`
                All numbers: ${all}
                All vocals: ${vocals}
                Secret: ${secret}
            `);

        });

    });

    server.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    });

})();
