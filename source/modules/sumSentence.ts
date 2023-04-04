import {fileReader} from '../util/file-reader';

const SPLIT_REGEX = /[.;!?]/g;
const NUMBER_REGEX = /\d/g;

process.on('message', (filePath: string) => {

    let index = 0;

    const parsed: { sum: number, index: number }[] = [];

    const reader = fileReader(filePath);

    reader.on('line', (line) => {

        // Split line by sentence separators
        const sentences = line.split(SPLIT_REGEX);
        SPLIT_REGEX.lastIndex = 0;

        // Move through sentences, sl = sentences.length removes the need to look up length on every iteration
        for (let i = 0, sl = sentences.length; i < sl; i++, index++) {

            // Find all numbers in current sentence
            const numbersInSentence = sentences[i].match(NUMBER_REGEX);
            NUMBER_REGEX.lastIndex = 0;

            if (numbersInSentence) {

                let sum = 0;

                // Sum all numbers
                for (let i = 0, nl = numbersInSentence.length; i < nl; i++) {

                    sum += parseInt(numbersInSentence[i]);

                }

                // Store sum and current index
                parsed.push({
                    sum, index
                });

            }

        }

    });

    reader.on('close', () => {

        // Sort parsed array by sum desc
        const sortedBySum = [...parsed].sort((a, b) => b.sum - a.sum);

        // Grab 10 biggest sums and sort by index
        const sortedByIndex = [...sortedBySum].slice(0, 10).sort((a, b) => a.index - b.index);

        process!.send!(
            sortedByIndex.reduce((result, obj, i) => {

                // Get char code by sum minus current index
                result += String.fromCharCode(obj.sum - i);

                return result;
            }, '')
        );

        process!.exit();

    });

});
