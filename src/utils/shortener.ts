export class Shortener {
    public static ACCEPTABLE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
    public static HASH_LEN = 7;

    public genHash(length: number, acceptableCharacters: string): string {
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

    public randNum(min: number, max: number): number {
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
