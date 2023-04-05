import {promisify} from 'util';
import {pipeline} from 'stream';
import {readFile} from 'fs';

export const pipelineAsync = promisify(pipeline);
export const fileReaderAsync = promisify(readFile);
