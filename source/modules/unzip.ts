import {createReadStream, createWriteStream,} from 'fs';
import * as zlib from 'zlib';
import * as path from 'path';
import {pipelineAsync} from '../util/promisified';

// Unzips a file
export const unzip = async (sourceFile: string, targetFile: string): Promise<void> => {

    console.time(`Unzip`);
    console.info(`Unzipping file ${sourceFile} to ${targetFile}`);

    const unzip = zlib.createUnzip();

    const source = createReadStream(path.join(__dirname, sourceFile));
    const target = createWriteStream(path.join(__dirname, targetFile));

    return pipelineAsync(source, unzip, target)
        .then(() => console.timeEnd(`Unzip`));
};
