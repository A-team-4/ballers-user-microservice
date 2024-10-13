import request from 'supertest';
import app from '../server';
import { URL_NOT_FOUND } from '../constants/error-messages';

describe('server.ts', () => {
  afterAll(async () => {
    app.close();
  });

  describe('GET /', () => {
    it('should return Not Found with status code 404 if url not found', async () => {
      const response = await request(app).get(`/`).expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          error: URL_NOT_FOUND,
        }),
      );
    });
  });
});
