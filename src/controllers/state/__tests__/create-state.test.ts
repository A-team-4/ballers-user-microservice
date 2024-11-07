import request from 'supertest';
import app from '../../../app';
import {
  COUNTRY_NOT_FOUND,
  INVALID_ID,
  NAME_REQUIRED,
  STATE_CREATED_MESSAGE,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';
import { IState } from '../../../interfaces/state.interface';
import mongoose from 'mongoose';

describe('createStateController', () => {
  const body = { name: 'ogun' };
  const countryId = new mongoose.Types.ObjectId();
  let createStateServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /state', () => {
    it('should return status code 422 if name is not provided', async () => {
      const response = await request(app)
        .post('/api/state')
        .send({ countryId })
        .expect(422);

      expect(response.body).toEqual({
        message: NAME_REQUIRED,
      });
    });

    it('should return status code 400 if countryId is not valid', async () => {
      const invalidCountryId = 'invalid-id';
      const response = await request(app)
        .post('/api/state')
        .send({ name: body.name, countryId: invalidCountryId })
        .expect(400);

      expect(response.body).toEqual({
        message: INVALID_ID,
      });
    });

    it('should return status code 404 if country not found', async () => {
      createStateServiceSpy = jest
        .spyOn(StateService, 'createState')
        .mockRejectedValueOnce(new Error('Country not found'));

      const response = await request(app)
        .post('/api/state')
        .send({ name: body.name, countryId: '507f1f77bcf86cd799439011' })
        .expect(404);

      expect(response.body).toEqual({
        message: COUNTRY_NOT_FOUND,
      });

      expect(createStateServiceSpy).toHaveBeenCalledTimes(1);
    });

    it('should return status code 201 if state is created successfully', async () => {
      createStateServiceSpy = jest
        .spyOn(StateService, 'createState')
        .mockResolvedValueOnce({ name: body.name } as IState);

      const response = await request(app)
        .post('/api/state')
        .send({ name: body.name, countryId })
        .expect(201);

      expect(response.body).toEqual({
        message: STATE_CREATED_MESSAGE,
      });

      expect(createStateServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
