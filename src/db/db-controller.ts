import { UrlyDatabaseConnection } from './db-connection';
import { Shortener } from '../utils/shortener';
import { URLResultModel } from './models';

export class UrlyDatabaseController {
    private _db: UrlyDatabaseConnection;

    constructor(db: UrlyDatabaseConnection) {
        this._db = db;
    }

    get db(): UrlyDatabaseConnection {
        return this._db;
    }

    /**
     * Returns a URL from a hash
     * @param hash hash value for shortened URL
     * @returns URL results or and empty set
     */
    async getByHash(hash: string): Promise<URLResultModel> {
        const query = `SELECT * FROM url WHERE hash = '${hash}'`;
        const [result] = await this._db.dbAll(query);

        return result || { hash: '', url: '' };
    }

    /**
     * Retrieves shortened URL result based on supplied URL
     * @param url url to shorten
     * @returns URL results or an empty set
     */
    async getByURL(url: string): Promise<URLResultModel> {
        const query = `SELECT * FROM url WHERE url = '${url}'`;
        const rows = await this._db.dbAll(query);

        return rows[0];
    }

    /**
     * Inserts a new URL and returns the resulting hash
     * @param url url to shorten
     * @returns URL results or an empty set
     */
    async insertURL(url: string): Promise<URLResultModel> {
        // Check if the URL is already in the DB
        // If it is return the hash immediately
        console.log('checking if URL is in DB');
        const matchingURL = await this.getByURL(url);
        if (matchingURL) {
            console.log('URL is in DB');
            return { hash: matchingURL.hash, url: url };
        }

        // Generate a new hash
        console.log('URL is not in DB');
        const acceptableCharacters = 'abcdefghjkmnpqrstuvwxyz23456789';
        const hashLength = 7;
        const shortener = new Shortener(acceptableCharacters, hashLength);
        const hash = shortener.genHash(hashLength, acceptableCharacters);

        // Insert it into the DB
        console.log('adding has to DB');
        const query = `INSERT INTO url ('hash', 'url') VALUES (?,?)`;
        const result = await this._db.dbRunPrepared(query, [hash, url]);

        // Return it
        return { hash, url };
    }
}
