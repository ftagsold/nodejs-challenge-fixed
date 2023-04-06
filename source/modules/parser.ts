import * as fs from "fs";
import * as path from "path";
import {createInterface, Interface} from "readline";
import {Heap} from "../util/heap";

export type Result = { secretStr: string, sumDigits: number, sumVowels: number };

/**
 * Parses a file and returns a result object.
 * The result object contains the sum of all digits in the file,
 * the sum of all vowels in the file and the 10 biggest sums of digits in sentences.
 */
export class Parser {

    private heap: Heap;
    private reader: Interface;

    private sumDigits: number = 0;
    private sumVowels: number = 0;

    private sentences: string[] = [];

    private readonly DIGIT_REGEX = /\d/g;
    private readonly SPLIT_REGEX = /[.!?]\s|\n/g;
    private readonly VOWEL_REGEX = /[aAeEiIoOuU]/g;

    private static readonly VOWEL_VAL_MAP: { [key: string]: number } = {
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

    constructor(readonly size: number, readonly filePath: string) {
        this.heap = new Heap(size);
        this.reader = this.getInterface(filePath);
    }

    // Parse the file and return a promise with the result object
    parse(): Promise<Result> {

        console.time('Parsing');
        console.info(`Parsing file ${this.filePath}`);

        return new Promise((resolve, reject) => {

            let incomplete = '';

            // Read the file line by line (expect huge files)
            this.reader.on('line', (line) => {

                line = line.trim();

                if (line) {

                    line = (incomplete ? (incomplete + ' ') : '') + line;

                    const sentences = line.split(this.SPLIT_REGEX);

                    // Reset last index to prevent faulty results caused by global modifier
                    this.SPLIT_REGEX.lastIndex = 0;

                    // If there was more than one complete sentence
                    // add all but the last sentence to the sentences array
                    if (sentences.length > 1) {

                        this.sentences.push(
                            ...sentences.slice(0, -1)
                        );

                    }

                    // Check if the current string ends with a sentence delimiter
                    if (!this.lineEndsWithSentenceDelimiter(line)) {

                        // If the current string does not end with a sentence delimiter
                        // it is incomplete and will be added to the next line
                        incomplete += sentences.slice(-1).join(' ');

                    } else {

                        // If the current string ends with a sentence delimiter
                        // it is complete and will be added to the sentences array
                        this.sentences.push(
                            ...sentences.slice(-1)
                        );

                        incomplete = '';

                    }

                    // Parse found sentences
                    this.flush();

                }

            });

            this.reader.on('error', (err) => {
                reject(err);
            });

            this.reader.on('close', () => {

                this.flush();

                resolve({
                    sumDigits: this.sumDigits,
                    sumVowels: this.sumVowels,
                    secretStr: this.heap.toString()
                });

                console.timeEnd('Parsing');

            });

        });
    }

    /*
     * Creates a readline interface for the given file.
     */
    private getInterface(filePath: string): Interface {
        return createInterface({
            input: fs.createReadStream(path.join(__dirname, filePath))
        });
    }

    /*
     * Checks if the given line ends with a sentence delimiter.
     */
    private lineEndsWithSentenceDelimiter(line: string): boolean {
        return line.endsWith('.') || line.endsWith('!') || line.endsWith('?');
    }

    /*
     * Flushes the current sentences and sums the digits and vowels.
     * The 10 biggest sums of digits in sentences are added to the heap.
     */
    private flush(): void {

        // Iterate over all sentences
        for (let si = 0, sl = this.sentences.length; si < sl; si++) {

            let sumSentence = 0;

            const sentence = this.sentences[si].trim();

            if (sentence) {

                // Match all digits and vowels in the sentence
                const digits = sentence.match(this.DIGIT_REGEX);
                const vowels = sentence.match(this.VOWEL_REGEX);

                this.DIGIT_REGEX.lastIndex = 0;
                this.VOWEL_REGEX.lastIndex = 0;

                if (digits) {

                    // Sum the digits
                    for (let di = 0, dl = digits.length; di < dl; di++) {

                        const digit = parseInt(digits[di], 10);

                        this.sumDigits += digit;
                        sumSentence += digit;

                    }

                }

                if (vowels) {

                    // Sum the vowels
                    for (let vi = 0, vl = vowels.length; vi < vl; vi++) {

                        this.sumVowels += Parser.VOWEL_VAL_MAP[vowels[vi]];

                    }

                }

                this.heap.push(sumSentence);

            }

        }

        this.sentences = [];

    }

}
