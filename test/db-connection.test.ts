import { UrlyDatabaseConnection } from '../src/db/db-connection';

import * as path from 'path';
import * as fs from 'fs-extra';
import { Database } from 'sqlite3';

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures');
const DB_PATH = path.resolve(FIXTURE_PATH, 'db', 'urly.db');
const TMP_PATH = path.resolve(FIXTURE_PATH, 'tmp');
const TMP_DB_PATH = path.resolve(TMP_PATH, 'urly.db');

describe('UrlyDatabaseConnection', () => {
    beforeEach(() => {
        fs.ensureDirSync(TMP_PATH);
        fs.copyFileSync(DB_PATH, TMP_DB_PATH);
    });

    afterEach(() => {
        fs.removeSync(TMP_PATH);
    });

    describe('constructor', () => {
        it('should save path the database file', () => {
            const inputPath = 'bogus.db';
            const conn = new UrlyDatabaseConnection(inputPath);

            expect(conn.dbPath).toEqual(inputPath);
        });
    });

    describe('init', () => {
        it('should throw error if dbPath is invalid', async () => {
            const inputPath = 'bogus.db';
            const conn = new UrlyDatabaseConnection(inputPath);

            expect.assertions(1);

            try {
                const db: Database = await conn.init();
            } catch (error) {
                expect(error.message).toMatch(/unable to open database file/);
            }
        });

        it('should initialize database', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            const db: Database = await conn.init();
            expect(db.run).toBeDefined();
        });
    });
});
