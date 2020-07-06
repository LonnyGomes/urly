import { UrlyDatabaseConnection } from './db-connection';
import { Shortener } from '../utils/shortener';
import { URLResultModel } from './models';
import Debug from 'debug';

const debug = Debug('db:controller');

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
        const [result] = await this._db.dbAll(query);

        return result || { hash: '', url: '' };
    }

    /**
     * Inserts a new URL and returns the resulting hash
     * @param fullUrl url to shorten
     * @returns URL results or an empty set
     */
    async insertURL(fullUrl: string): Promise<URLResultModel> {
        // Check if the URL is already in the DB
        // If it is return the hash immediately
        debug('checking if URL is in DB');
        const { url, hash } = await this.getByURL(fullUrl);
        if (url && hash) {
            debug('URL is in DB');
            return { hash, url };
        }

        // Generate a new hash
        debug('URL is not in DB');
        const acceptableCharacters = 'abcdefghjkmnpqrstuvwxyz23456789';
        const hashLength = 7;
        const shortener = new Shortener(acceptableCharacters, hashLength);
        const newHash = shortener.genHash(hashLength, acceptableCharacters);

        // Insert it into the DB
        debug('adding has to DB');
        const query = `INSERT INTO url ('hash', 'url') VALUES (?,?)`;
        await this._db.dbRunPrepared(query, [newHash, fullUrl]);

        // Return it
        return { hash: newHash, url: fullUrl };
    }
}
