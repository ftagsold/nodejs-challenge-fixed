import {fileReader} from "../util/file-reader";

const NUMBER_REGEX = /\d+/g;

export const sumFile = async (filePath: string): Promise<number> => {

    return new Promise((resolve, reject) => {

        let sumAll = 0;

        const reader = fileReader(filePath);

        // Read file line by line (expect 4gb :D)
        reader.on('line', (line) => {

            // Find all numbers on current line
            const numbersInLine = line.match(NUMBER_REGEX);

            if (numbersInLine) {

                // Sum all numbers and add result to sumAll
                sumAll += numbersInLine.reduce((r, n) => r += parseInt(n), 0);

            }

        });

        // Resolve promise with final result
        reader.on('close', () => {

            resolve(sumAll);

        });

    });

}
