import {lineReader} from '../util/line-reader';

const DIGIT_REGEX = /\d/g;
const SPLIT_REGEX = /[.;!?]/g;
const VOWEL_REGEX = /[aAeEiIoOuU]/g;

export type Result = { sumDigits: number, sumVowels: number, secret: string };

export const VOWEL_VAL_MAP: { [key: string]: number } = {
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

export const parser = async (filePath: string): Promise<Result> => {

    return new Promise((resolve) => {

        let sumDigits = 0;
        let sumVowels = 0;

        const topTen: number[] = [];

        const reader = lineReader(filePath);

        // Read file line by line (expect 6,4gb :D)
        reader.on('line', (line) => {

            if (line.trim()) {

                const sentences = line.split(SPLIT_REGEX);
                SPLIT_REGEX.lastIndex = 0;

                for (let si = 0, sl = sentences.length; si < sl; si++) {

                    let sumSentence = 0;

                    const sentence = sentences[si];

                    if (sentence.trim()) {

                        const digits = sentence.match(DIGIT_REGEX);
                        const vowels = sentence.match(VOWEL_REGEX);

                        DIGIT_REGEX.lastIndex = 0;
                        VOWEL_REGEX.lastIndex = 0;

                        if (digits) {

                            for (let di = 0, dl = digits.length; di < dl; di++) {

                                const digit = parseInt(digits[di], 10);

                                sumSentence += digit;
                                sumDigits += digit;

                            }

                        }

                        if (vowels) {

                            for (let vi = 0, vl = vowels.length; vi < vl; vi++) {

                                sumVowels += VOWEL_VAL_MAP[vowels[vi]];

                            }

                        }

                        if (topTen.length < 10) {

                            topTen.push(sumSentence);

                        } else {

                            const min = Math.min(...topTen);

                            if (sumSentence > min) {

                                topTen.splice(
                                    topTen.indexOf(min), 1
                                );

                                topTen.push(sumSentence);

                            }

                        }

                    }

                }

            }

        });

        // Resolve promise with final result
        reader.on('close', () => {

            resolve({
                sumDigits, sumVowels, secret: topTen.reduce((result, sum, i) => {

                    // Get char code by sum minus current index
                    result += String.fromCharCode(sum - i);

                    return result;
                }, '')
            });

        });

    });

};
