import {fileReader} from '../util/file-reader';

const VOCAL_REGEX = /[aeiouAEIOU]/g;

// Duplicates required, toLowerCase on every vocal would be slower
const VOCAL_VAL_MAP: { [key: string]: number } = {
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

process.on('message', (filePath: string) => {

    let sumVocals = 0;

    const reader = fileReader(filePath);

    reader.on('line', (line) => {

        // Find all vocals in line
        const vocalsInLine = line.match(VOCAL_REGEX);
        VOCAL_REGEX.lastIndex = 0;

        if (vocalsInLine) {

            // Sum all vocals with their corresponding values
            for (let i = 0, vl = vocalsInLine.length; i < vl; i++) {

                sumVocals += VOCAL_VAL_MAP[vocalsInLine[i]];

            }

        }

    });

    // Resolve with final result
    reader.on('close', () => {

        process?.send!(sumVocals);

        process?.exit();

    });

});
