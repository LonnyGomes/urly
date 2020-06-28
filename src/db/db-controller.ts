import { UrlyDatabaseConnection } from './db-connection';

export class UrlyDatabaseController {
    private _db: UrlyDatabaseConnection;

    constructor(db: UrlyDatabaseConnection) {
        this._db = db;
    }

    get db(): UrlyDatabaseConnection {
        return this._db;
    }
}
