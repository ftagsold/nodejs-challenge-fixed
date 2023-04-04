import {createReadStream, createWriteStream,} from 'fs';
import * as zlib from 'zlib';
import * as path from 'path';
import {pipelineAsync} from '../util/promisified';

export const unzip = async (sourcePath: string, targetPath: string): Promise<void> => {

    const unzip = zlib.createUnzip();

    const source = createReadStream(path.join(__dirname, sourcePath));
    const target = createWriteStream(path.join(__dirname, targetPath));

    return pipelineAsync(source, unzip, target);
};
