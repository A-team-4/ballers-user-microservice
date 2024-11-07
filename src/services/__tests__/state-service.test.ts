import mongoose from 'mongoose';
import { getStateByIdService } from '../../services/state-service';
import { State } from '../../models/state';
import { IState } from '../../interfaces/state.interface';

// Mock the State model
jest.mock('../../models/state');

describe('getStateByIdService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the state if it exists', async () => {
    const mockState: IState = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Lagos',
    } as IState;

    // Mock the findById method to return the mock state
    (State.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockState),
    });

    const result = await getStateByIdService(mockState._id as string);

    // Assert: Check if the service returns the correct data
    expect(result).toEqual(mockState);
    expect(State.findById).toHaveBeenCalledWith(mockState._id);
    expect(State.findById).toHaveBeenCalledTimes(1);
  });

  it('should return null if the state does not exist', async () => {
    const validNonexistentId = new mongoose.Types.ObjectId().toString();

    // Mock the findById method to return null
    (State.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(null),
    });

    const result = await getStateByIdService(validNonexistentId);

    // Assert: Check if the service returns null when state is not found
    expect(result).toBeNull();
    expect(State.findById).toHaveBeenCalledWith(validNonexistentId);
    expect(State.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if an invalid ID format is provided', async () => {
    const invalidId = 'invalid_id_format';

    // Call the service with the invalid ID and expect it to throw an error
    await expect(getStateByIdService(invalidId)).rejects.toThrow(
      'Invalid ID format',
    );
    expect(State.findById).not.toHaveBeenCalled();
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const errorMessage = 'Database connection error';
    const validId = new mongoose.Types.ObjectId().toString();

    // Mock the findById method to throw an error
    (State.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(getStateByIdService(validId)).rejects.toThrow(errorMessage);
    expect(State.findById).toHaveBeenCalledWith(validId);
    expect(State.findById).toHaveBeenCalledTimes(1);
  });
});
