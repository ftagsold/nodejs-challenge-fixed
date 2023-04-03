import {fileReader} from '../util/file-reader';

const SPLIT_REGEX = /[.;!?]/g;
const NUMBER_REGEX = /\d+/g;

export const sumBySentences = async (filePath: string): Promise<string> => {

    return new Promise((resolve, reject) => {

        const parsed: { sum: number, index: number }[] = [];

        const reader = fileReader(filePath);

        reader.on('line', (line) => {

            // Split line by sentence separators
            const sentences = line.split(SPLIT_REGEX);

            // Move through sentences, sl = sentences.length removes the need to look up length on every iteration
            for (let index = 0, sl = sentences.length; index < sl; index++) {

                // Find all numbers in current sentence
                const numbers = sentences[index].match(NUMBER_REGEX);

                if (numbers) {

                    // Sum all numbers
                    const sum = numbers.reduce((r, n) => r += parseInt(n), 0);

                    // Store sum and current index
                    parsed.push({
                        sum, index
                    });

                }

            }

        });

        reader.on('close', () => {

            // TODO: There should be a more performant way to do this by my time is running out (array clone == bad)
            // Sort parsed array by sum desc
            const sortedBySum = [...parsed].sort((a, b) => b.sum - a.sum);

            // Grab 10 biggest sums and sort by index
            const sortedByIndex = [...sortedBySum].slice(0, 10).sort((a, b) => a.index - b.index);

            resolve(
                sortedByIndex.reduce((result, obj, i) => {

                    // Get char code by sum minus current index
                    result += String.fromCharCode(obj.sum - i);

                    return result;
                }, '')
            );

        });

    });

}
