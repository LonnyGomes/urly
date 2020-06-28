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
     * @returns URL results or null
     */
    async getByHash(hash: string): Promise<URLResultModel> {
        const query = `SELECT * FROM url WHERE hash = '${hash}'`;
        const [result] = await this._db.dbAll(query);

        return result || { hash: '', url: '' };
    }
}
