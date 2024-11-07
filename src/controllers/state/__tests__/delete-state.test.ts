import request from 'supertest';
import app from '../../../app';
import {
  INTERNAL_SERVER_ERROR,
  SUCCESS_MESSAGE,
} from '../../../constants/contants';
import * as StateService from '../../../services/state-service';

describe('delete-state.ts', () => {
  // Generate a valid ObjectId for testing
  const id = 'ashhj';
  let deleteStateServiceSpy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return status code 200 if request is successful', async () => {
    // Mock deleteStateService to resolve successfully
    deleteStateServiceSpy = jest
      .spyOn(StateService, 'deleteStateService')
      .mockImplementation();

    // Send the request with the valid id
    const response = await request(app).delete(`/api/state/${id}`).expect(200);

    // Validate response
    expect(response.body).toEqual(
      expect.objectContaining({
        message: SUCCESS_MESSAGE,
      }),
    );

    // Validate the service method is called as expected
    expect(deleteStateServiceSpy).toHaveBeenCalledTimes(1);
    expect(deleteStateServiceSpy).toHaveBeenCalledWith(id);
  });

  it('should call apiErrorHandler on error', async () => {
    // Mock deleteStateService to throw an error
    const err_message = 'Unexpected Error';
    deleteStateServiceSpy = jest
      .spyOn(StateService, 'deleteStateService')
      .mockImplementationOnce(() => {
        throw new Error(err_message);
      });
    const response = await request(app).delete(`/api/state/${id}`).expect(500);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: `${INTERNAL_SERVER_ERROR}: ${err_message}`,
      }),
    );

    // Ensure the error handler is called
    expect(deleteStateServiceSpy).toHaveBeenCalledTimes(1);
    expect(deleteStateServiceSpy).toHaveBeenCalledWith(id);
  });
});
