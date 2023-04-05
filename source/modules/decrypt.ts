import * as path from 'path';
import {createReadStream, createWriteStream} from 'fs';
import {createDecipheriv} from 'crypto';
import {fileReaderAsync, pipelineAsync} from '../util/promisified';

export const decrypt = async (ivFile: string, authFile: string, pwFile: string, sourceFile: string, targetFile: string) => {

    const iv = await getFile(ivFile, null);
    const pw = await getFile(pwFile, 'utf8');
    const auth = await getFile(authFile, null);

    const source = createReadStream(path.join(__dirname, sourceFile));
    const target = createWriteStream(path.join(__dirname, targetFile));

    const decipher = createDecipheriv('aes-256-gcm', pw.slice(0, 32), iv);
    decipher.setAuthTag(<Buffer>auth);

    return pipelineAsync(source, decipher, target);
};

const getFile = async (authFile: string, encoding: 'utf8' | null) => {

    return await fileReaderAsync(
        path.join(__dirname, authFile), {encoding}
    );

};
