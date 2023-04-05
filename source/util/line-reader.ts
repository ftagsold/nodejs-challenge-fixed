import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

export const lineReader = (filePath: string) => {

    return readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, filePath))
    });

};
