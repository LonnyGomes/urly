import { Shortener } from '../src/utils/shortener';
let shortener: Shortener;

describe('Shortener', () => {
    beforeEach(() => {
        shortener = new Shortener();
    });

    describe('genHash', () => {
        const hashChars = Shortener.ACCEPTABLE_CHARS;

        it('should generate hash of specified length', () => {
            let hashLen = 4;
            let results = shortener.genHash(hashLen, hashChars);
            expect(results.length).toEqual(hashLen);

            hashLen = 10;
            results = shortener.genHash(hashLen, hashChars);
            expect(results.length).toEqual(hashLen);
        });
    });

    describe('randNum', () => {
        it('should return random number between min and max values', () => {
            // NOTE: since the result is number we want to test multiple times
            // across a small sample set
            const testCount = 30;

            const minVal = 5;
            const maxVal = 10;
            let results: number;

            // cycle through this function several times to
            // reduce the entropy
            for (let idx = 0; idx < testCount; idx += 1) {
                results = shortener.randNum(minVal, maxVal);

                expect(results).toBeGreaterThanOrEqual(minVal);
                expect(results).toBeLessThanOrEqual(maxVal);
            }
        });
    });

    describe('shorten', () => {
        it('should throw an error when an invalid URL is supplied', () => {
            const expectedErrorMsg = 'Invalid URL supplied';
            const bogusURL1 = 'bogus-string';
            const bogusURL2 = 'ftp://myhost.com/';

            expect(() => shortener.shorten(bogusURL1)).toThrow(
                expectedErrorMsg
            );

            expect(() => shortener.shorten(bogusURL2)).toThrow(
                expectedErrorMsg
            );

            // TODO: add additional invalid URLs to test
        });

        it('should return cafe12 (for now)', () => {
            const result = shortener.shorten('https://google.com');
            const expectedResult = 'cafe12';

            expect(result).toEqual(expectedResult);
        });
    });
});
