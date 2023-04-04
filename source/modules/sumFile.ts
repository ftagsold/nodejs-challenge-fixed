import {fileReader} from '../util/file-reader';

const NUMBER_REGEX = /\d/g;

process.on('message', (filePath: string) => {

    let sumAll = 0;

    const reader = fileReader(filePath);

    // Read file line by line (expect 6,4gb :D)
    reader.on('line', (line) => {

        // Find all numbers on current line
        const numbersInLine = line.match(NUMBER_REGEX);
        NUMBER_REGEX.lastIndex = 0;

        if (numbersInLine) {

            // Sum all numbers
            for (let i = 0, nl = numbersInLine.length; i < nl; i++) {

                sumAll += parseInt(numbersInLine[i]);

            }

        }

    });

    // Resolve promise with final result
    reader.on('close', () => {

        process!.send!(sumAll);

        process!.exit();

    });

});
