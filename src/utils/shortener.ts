export class Shortener {
    public static DEFAULT_ACCEPTABLE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
    public static DEFAULT_HASH_LEN = 7;

    private _hashChars: string;
    private _hashLen: number;

    constructor(
        hashChars: string = Shortener.DEFAULT_ACCEPTABLE_CHARS,
        hashLen: number = Shortener.DEFAULT_HASH_LEN
    ) {
        this._hashChars = hashChars;
        this._hashLen = hashLen;
    }

    get hashChars(): string {
        return this._hashChars;
    }

    get hashLen(): number {
        return this._hashLen;
    }

    public genHash(): string {
        // Build an array of random characters
        const randomChars = [];
        for (let i = 0; i < this._hashLen; i++) {
            randomChars.push(
                this._hashChars[
                    this.randNum(0, this._hashChars.length - 1)
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
