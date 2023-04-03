import * as path from 'path';
import {promisify} from 'util';
import {createReadStream, createWriteStream, readFile} from 'fs';
import {createDecipheriv} from 'crypto';
import {pipelineAsync} from "../util/promisified";

const fileReader = promisify(readFile);

export const decrypt = async (ivFile: string, authFile: string, pwFile: string, sourceFile: string, targetFile: string) => {

    const iv = await getIV(ivFile);
    const pw = await getPw(pwFile);
    const auth = await getAuth(authFile);

    const source = createReadStream(path.join(__dirname, sourceFile));
    const target = createWriteStream(path.join(__dirname, targetFile));

    const decipher = createDecipheriv('aes-256-gcm', pw, iv);
    decipher.setAuthTag(auth);

    return pipelineAsync(source, decipher, target);
}

const getIV = async (ivFile: string) => {

    return await fileReader(
        path.join(__dirname, ivFile)
    );

};

const getAuth = async (authFile: string) => {

    return await fileReader(
        path.join(__dirname, authFile)
    );

};

const getPw = async (pwFile: string) => {

    const pw = await fileReader(
        path.join(__dirname, pwFile), {encoding: 'utf-8'}
    );

    return pw.slice(0, 32);
};
