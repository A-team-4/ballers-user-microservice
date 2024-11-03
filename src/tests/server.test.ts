import request from 'supertest';
import app from '../app';
import { URL_NOT_FOUND } from '../constants/contants';

describe('server.ts', () => {
  describe('GET /', () => {
    it('should return Not Found with status code 404 if url not found', async () => {
      const response = await request(app).get(`/`).expect(404);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: URL_NOT_FOUND,
        }),
      );
    });
  });
});
