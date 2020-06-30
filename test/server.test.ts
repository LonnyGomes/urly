import request from 'supertest';
import { initServer } from '../src/server';
import { UrlyDatabaseConnection } from '../src/db/db-connection';
import * as path from 'path';
import * as fs from 'fs-extra';

const FIXTURE_PATH = path.resolve(__dirname, 'fixtures');
const DB_PATH = path.resolve(FIXTURE_PATH, 'db', 'urly.db');
const TMP_PATH = path.resolve(FIXTURE_PATH, 'tmp');
const TMP_DB_PATH = path.resolve(TMP_PATH, 'urly.db');

describe('koa server', () => {
    let server: any;

    beforeEach(() => {
        fs.ensureDirSync(TMP_PATH);
        fs.copyFileSync(DB_PATH, TMP_DB_PATH);

        const db = new UrlyDatabaseConnection(TMP_DB_PATH);
        const app = initServer(db);
        server = app.callback();
    });

    afterEach(() => {
        fs.removeSync(TMP_PATH);
    });

    describe('app', () => {
        it('should return index page', async () => {
            const response: any = await request(server).get('/');

            expect(response.status).toEqual(200);
            expect(response.type).toEqual('text/html');
            expect(response.text).toMatch(/<html>/);
        });

        it('should redirect to 404 url if page not found', async () => {
            const response: any = await request(server).get('/bogus-file.html');

            // console.log('keys', Object.keys(response));

            expect(response.header.location).toMatch(/404.html$/);
            expect(response.type).toEqual('text/html');
            expect(response.text).toMatch(/^Redirecting to/);
        });
    });

    describe('/api', () => {
        describe('GET /url:fullUrl', () => {
            it('should return a URL when a valid hash is supplied', async () => {
                const expectedHashKey = 'abcd123';
                const expectedResponse = {
                    status: true,
                    fullUrl: 'https://www.google.com',
                };
                const response: any = await request(server).get(
                    `/api/url/${expectedHashKey}`
                );

                expect(response.status).toEqual(200);
                expect(response.body).toEqual(expectedResponse);
            });
        });
    });
});
