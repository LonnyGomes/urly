import { Shortener } from '../src/utils/shortener';
let shortener: Shortener;

describe('Shortener', () => {
    beforeEach(() => {
        shortener = new Shortener();
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
