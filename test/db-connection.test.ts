import { UrlyDatabaseConnection } from '../src/db/db-connection';

import * as path from 'path';
import * as fs from 'fs-extra';
import { Database } from 'sqlite3';

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures');
const DB_PATH = path.resolve(FIXTURE_PATH, 'db', 'urly.db');
const TMP_PATH = path.resolve(FIXTURE_PATH, 'tmp');
const TMP_DB_PATH = path.resolve(TMP_PATH, 'urly.db');

const SQL_SELECT_ALL_URL = 'SELECT * from url';
const SQL_INSERT_URL = `INSERT INTO url ('hash', 'url') VALUES (?,?)`;

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

    describe('dbAll', () => {
        it('should return results for a query', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            await conn.init();
            const results = await conn.dbAll(SQL_SELECT_ALL_URL);

            expect(Array.isArray(results)).toBeTruthy();
            const [item] = results;

            expect(item.hash).toBeDefined();
            expect(item.url).toBeDefined();
        });

        it('should throw error if db was not initialized before call', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            expect.assertions(1);
            try {
                const results = await conn.dbAll(SQL_SELECT_ALL_URL);
            } catch (error) {
                expect(error.message).toMatch(/^Database was not initialize$/);
            }
        });

        it('should return an empty array if query contains no results', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            await conn.init();
            const results = await conn.dbAll(
                'SELECT * from url WHERE url="non existent"'
            );

            expect(results).toBeDefined();
            expect(results.length).toEqual(0);
        });

        it('should throw error if query return zero results', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            expect.assertions(1);
            try {
                await conn.init();
                const results = await conn.dbAll('SELECT * FROM ...');
            } catch (error) {
                expect(error.message).toMatch(/syntax error/);
            }
        });
    });

    describe('dbRunPrepared', () => {
        it('should return results for a prepared query', async () => {
            const query = SQL_INSERT_URL;
            const hash = 'cafeb4b';
            const url = 'https://amazon.com';
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            await conn.init();
            const results = await conn.dbRunPrepared(query, [hash, url]);

            expect(results).toEqual('success');
        });

        it('should throw error if db was not initialized before call', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            expect.assertions(1);
            try {
                const results = await conn.dbRunPrepared(SQL_INSERT_URL, [
                    'hash',
                    'url',
                ]);
            } catch (error) {
                expect(error.message).toMatch(/^Database was not initialize/);
            }
        });

        it('should throw error if prepared query is invalid', async () => {
            const conn = new UrlyDatabaseConnection(TMP_DB_PATH);

            expect.assertions(1);
            try {
                await conn.init();
                const results = await conn.dbRunPrepared('INSERT URL (?, ?)', [
                    'hash',
                    'url',
                ]);
            } catch (error) {
                expect(error.message).toMatch(/syntax error/);
            }
        });
    });
});
