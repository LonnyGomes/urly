import { default as sqlite3, Database } from 'sqlite3';

export class UrlyDatabaseConnection {
    private _db: Database | undefined;
    private _dbPath: string;

    constructor(dbPath: string) {
        this._dbPath = dbPath;
    }

    init() {
        return new Promise((resolve, reject) => {
            let db = new Database(
                this._dbPath,
                sqlite3.OPEN_READWRITE,
                (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        console.log('connected to sqlite db');
                    }

                    this._db = db;

                    resolve(db);
                }
            );
        });
    }

    get dbPath(): string {
        return this._dbPath;
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
