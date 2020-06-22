export class Shortener {
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
