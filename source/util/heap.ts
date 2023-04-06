/**
 * Keeps track of the largest N numbers in order of occurrence.
 */
export class Heap {

    private heap: number[] = [];

    constructor(readonly size: number) {
    }

    push(value: number): void {

        // Fill the heap until it's full.
        if (this.heap.length < this.size) {

            this.heap.push(value);

        } else {

            // Get the smallest number in the heap.
            const min = Math.min(...this.heap);

            // If the new value is larger than the smallest number in the heap,
            // remove the smallest number and add the new value to the end of the heap.
            if (value > min) {

                this.heap.splice(
                    this.heap.indexOf(min), 1
                );

                this.heap.push(value);

            }

        }

    }

    // Convert the heap to a string.
    toString(): string {
        return this.heap.reduce((result, sum, i) => {
            result += String.fromCharCode(sum - i);
            return result;
        }, '')
    }

}
