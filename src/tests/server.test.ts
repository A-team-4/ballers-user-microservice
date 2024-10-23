import request from 'supertest';
import app from '../app';
import { testPORT, URL_NOT_FOUND } from '../constants/contants';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('server.ts', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse>;

  beforeAll(() => {
    testServer = app.listen(testPORT, async () => {
      //console.log(`Listening on PORT: ${testPORT}`);
    });
  });

  afterAll(async () => {
    testServer.close();
    testServer.closeAllConnections();
  });

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
