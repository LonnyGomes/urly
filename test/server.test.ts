import request from 'supertest';
import { app } from '../src/server';

describe('koa server', () => {
    let server: any;
    beforeEach(() => {
        server = app.callback();
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
});
