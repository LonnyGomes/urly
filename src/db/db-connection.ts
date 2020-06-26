import { default as sqlite3, Database } from 'sqlite3';

export class UrlyDatabaseConnection {
    private _db: Database | undefined;

    constructor() {}

    init(dbPath: string) {
        return new Promise((resolve, reject) => {
            let db = new Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
                if (err) {
                    reject(err.message);
                } else {
                    console.log('connected to sqlite db');
                }

                this._db = db;

                resolve(db);
            });
        });
    }

    dbAll(query: string) {
        return new Promise((resolve, reject) => {
            if (!this._db) {
                reject('Database was not initialize');
                return;
            }

            this._db.all(query, (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    dbRunPrepared(query: string, values: Array<any>) {
        return new Promise((resolve, reject) => {
            if (!this._db) {
                reject('Database was not initialize');
                return;
            }

            const stmt = this._db.prepare(query);
            stmt.run(values, (err) => {
                if (err) {
                    console.log('error', err);
                    reject(err);
                } else {
                    resolve('success');
                }
            });
        });
    }
}
