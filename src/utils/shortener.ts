export class Shortener {
    private ACCEPTABLE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
    private HASH_LEN = 7;

    private genHash(length: number, acceptableCharacters: string) {
        // Build an array of random characters
        const randomChars = [];
        for (let i = 0; i < length; i++) {
            randomChars.push(
                acceptableCharacters[
                    this.randNum(0, acceptableCharacters.length - 1)
                ]
            );
        }
        // Join the characters together and return them
        return randomChars.join('');
    }

    private randNum(min: number, max: number) {
        const dif = max - min;
        return Math.round(Math.random() * dif) + min;
    }

    public shorten(url: string): string {
        if (!url) {
            throw new Error('URL not supplied');
        }

        // TODO: enhance URL validation
        if (!url.match(/^http/)) {
            throw new Error('Invalid URL supplied');
        }

        return 'cafe12';
    }
}
