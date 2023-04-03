import {fileReader} from '../util/file-reader';

const REGEX = /[aeiou]/gi;

// Duplicates required, toLowerCase on every vocal would be slower
const VOCAL_VAL_MAP = {
    a: 2,
    A: 2,
    e: 4,
    E: 4,
    i: 8,
    I: 8,
    o: 16,
    O: 16,
    u: 32,
    U: 32
};

export const sumVocals = async (filePath: string): Promise<number> => {

    return new Promise((resolve, reject) => {

        let sumVocals = 0;

        const reader = fileReader(filePath);

        reader.on('line', (line) => {

            // Find all vocals in line
            const vocalsInLine = line.match(REGEX);

            if (vocalsInLine) {

                // Sum all vocals with their corresponding values
                sumVocals += vocalsInLine.reduce((r, v) => r += VOCAL_VAL_MAP[v], 0);

            }

        });

        // Resolve with final result
        reader.on('close', () => {

            resolve(sumVocals);

        });

    });

}
