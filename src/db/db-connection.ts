import { default as sqlite3, Database } from 'sqlite3';
import { URLResultModel } from './models';
import Debug from 'debug';

const debug = Debug('db:connection');

export class UrlyDatabaseConnection {
    private _db: Database | undefined;
    private _dbPath: string;

    constructor(dbPath: string) {
        this._dbPath = dbPath;
    }

    private async seedDb() {
        // create schema
        await this.dbAll(
            'CREATE TABLE IF NOT EXISTS url(hash VARCHAR(40) PRIMARY KEY, url VARCHAR(200))'
        );
    }

    init(): Promise<Database> {
        return new Promise((resolve, reject) => {
            sqlite3.verbose(); // enable verbose debugging
            let db = new Database(
                this._dbPath,
                sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
                async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        debug('connected to sqlite db');
                        this._db = db;

                        try {
                            debug('seeding database');
                            await this.seedDb();
                            resolve(db);
                        } catch (seedError) {
                            reject(seedError);
                        }
                    }
                }
            );
        });
    }

    close(): Promise<{ message: string }> {
        return new Promise((resolve, reject) => {
            if (!this._db) {
                reject(new Error('Database was not initialize'));
                return;
            }

            this._db.close((err) => {
                if (err) {
                    reject(err.message);
                } else {
                    const message = 'Closed database';
                    debug(message);
                    resolve({ message });
                }
            });
        });
    }

    get dbPath(): string {
        return this._dbPath;
    }

    dbAll(query: string): Promise<URLResultModel[]> {
        return new Promise((resolve, reject) => {
            if (!this._db) {
                reject(new Error('Database was not initialize'));
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
                reject(new Error('Database was not initialize'));
                return;
            }

            const stmt = this._db.prepare(query, (prepareErr) => {
                if (prepareErr) {
                    reject(prepareErr);
                    return;
                }

                stmt.run(values, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve('success');
                    }
                });
            });
        });
    }
}
