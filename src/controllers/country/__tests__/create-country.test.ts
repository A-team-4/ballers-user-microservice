import request from 'supertest';
import app from '../../../app';
import {
  COUNTRY_CREATED_MESSAGE,
  NAME_REQUIRED,
  testPORT,
} from '../../../constants/contants';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('create-country.ts', () => {
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

  describe('POST /', () => {
    it('should return status code 422 if body is empty', async () => {
      const response = await request(app).post(`/api/country`).expect(422);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: NAME_REQUIRED,
        }),
      );
    });

    it('should return status code 200 if request successful', async () => {
      const body = { name: 'Nigeria' };
      const response = await request(app)
        .post(`/api/country`)
        .send(body)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          message: COUNTRY_CREATED_MESSAGE,
        }),
      );
    });
  });
});
