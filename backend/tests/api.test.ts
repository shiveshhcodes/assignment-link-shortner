import request from 'supertest';
import { prisma } from '../lib/prisma';

const BASE_URL = 'http://localhost:8000';

describe('TinyLink API', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.link.deleteMany({});
    });

    describe('GET /healthz', () => {
        it('should return health status', async () => {
            const response = await request(BASE_URL).get('/healthz');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ok: true, version: '1.0' });
        });
    });

    describe('POST /api/links', () => {
        it('should create a link with auto-generated code', async () => {
            const response = await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com' });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('code');
            expect(response.body).toHaveProperty('target', 'https://example.com');
            expect(response.body).toHaveProperty('total_clicks', 0);
            expect(response.body).toHaveProperty('last_clicked', null);
            expect(response.body).toHaveProperty('created_at');
            expect(response.body.code).toMatch(/^[A-Za-z0-9]{6}$/);
        });

        it('should create a link with custom code', async () => {
            const response = await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'custom1' });

            expect(response.status).toBe(201);
            expect(response.body.code).toBe('custom1');
        });

        it('should return 400 for invalid URL', async () => {
            const response = await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'not-a-url' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Invalid URL. Use http:// or https://' });
        });

        it('should return 400 for invalid code format', async () => {
            const response = await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'ab' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Code must be 6–8 alphanumeric characters' });
        });

        it('should return 409 for duplicate code', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'dup123' });

            const response = await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://another.com', code: 'dup123' });

            expect(response.status).toBe(409);
            expect(response.body).toEqual({ error: 'Code already exists' });
        });
    });

    describe('GET /api/links', () => {
        it('should list all links', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example1.com', code: 'test001' });

            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example2.com', code: 'test002' });

            const response = await request(BASE_URL).get('/api/links');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should filter links by search query', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'search1' });

            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://other.com', code: 'other22' });

            const response = await request(BASE_URL).get('/api/links?q=search');

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].code).toBe('search1');
        });
    });

    describe('GET /api/links/:code', () => {
        it('should return link details', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'get123' });

            const response = await request(BASE_URL).get('/api/links/get123');

            expect(response.status).toBe(200);
            expect(response.body.code).toBe('get123');
            expect(response.body.target).toBe('https://example.com');
        });

        it('should return 404 for non-existent code', async () => {
            const response = await request(BASE_URL).get('/api/links/notfound');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('DELETE /api/links/:code', () => {
        it('should soft delete a link', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'del123' });

            const deleteResponse = await request(BASE_URL).delete('/api/links/del123');
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.body).toEqual({ ok: true });

            const getResponse = await request(BASE_URL).get('/api/links/del123');
            expect(getResponse.status).toBe(404);
        });

        it('should return 404 when deleting non-existent link', async () => {
            const response = await request(BASE_URL).delete('/api/links/notfound');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Not found' });
        });
    });

    describe('GET /:code (redirect)', () => {
        it('should redirect and increment clicks', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'redir1' });

            const redirectResponse = await request(BASE_URL)
                .get('/redir1')
                .redirects(0);

            expect(redirectResponse.status).toBe(302);
            expect(redirectResponse.headers.location).toBe('https://example.com');

            const linkResponse = await request(BASE_URL).get('/api/links/redir1');
            expect(linkResponse.body.total_clicks).toBe(1);
            expect(linkResponse.body.last_clicked).not.toBeNull();
        });

        it('should return 404 for deleted link redirect', async () => {
            await request(BASE_URL)
                .post('/api/links')
                .send({ target: 'https://example.com', code: 'redir2' });

            await request(BASE_URL).delete('/api/links/redir2');

            const redirectResponse = await request(BASE_URL)
                .get('/redir2')
                .redirects(0);

            expect(redirectResponse.status).toBe(404);
        });
    });
});
