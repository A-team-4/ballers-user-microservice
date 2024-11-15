import mongoose from 'mongoose';
import {
  createState,
  deleteStateService,
  getStateByIdService,
  getStateByCountryIdService,
  updateStateService,
} from '../../services/state-service';
import { State } from '../../models/state';
import { IState } from '../../interfaces/state.interface';
import { Country } from '../../models/country';

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
      countryId: new mongoose.Types.ObjectId(),
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

describe('getStateByCountryIdService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of states if states exist for the given country ID', async () => {
    const mockCountryId = new mongoose.Types.ObjectId().toString();
    const mockStates: IState[] = [
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Lagos',
        countryId: mockCountryId,
      } as unknown as IState,
      {
        _id: new mongoose.Types.ObjectId().toString(),
        name: 'Abuja',
        countryId: mockCountryId,
      } as unknown as IState,
    ];

    // Mock the find method to return the mock states
    (State.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockStates),
    });

    const result = await getStateByCountryIdService(mockCountryId);

    // Assert: Check if the service returns the correct data
    expect(result).toEqual(mockStates);
    expect(State.find).toHaveBeenCalledWith({ countryId: mockCountryId });
    expect(State.find).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array if no states exist for the given country ID', async () => {
    const mockCountryId = new mongoose.Types.ObjectId().toString();

    // Mock the find method to return an empty array
    (State.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await getStateByCountryIdService(mockCountryId);

    // Assert: Check if the service returns an empty array when no states are found
    expect(result).toEqual([]);
    expect(State.find).toHaveBeenCalledWith({ countryId: mockCountryId });
    expect(State.find).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if an invalid Country ID format is provided', async () => {
    const invalidCountryId = 'invalid_id_format';

    // Call the service with the invalid country ID and expect it to throw an error
    await expect(getStateByCountryIdService(invalidCountryId)).rejects.toThrow(
      'Invalid Country ID format',
    );
    expect(State.find).not.toHaveBeenCalled();
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const mockCountryId = new mongoose.Types.ObjectId().toString();
    const errorMessage = 'Database connection error';

    // Mock the find method to throw an error
    (State.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
    });

    await expect(getStateByCountryIdService(mockCountryId)).rejects.toThrow(
      errorMessage,
    );
    expect(State.find).toHaveBeenCalledWith({ countryId: mockCountryId });
    expect(State.find).toHaveBeenCalledTimes(1);
  });
});

jest.mock('../../models/state');
jest.mock('../../models/country');

describe('create-state.ts', () => {
  const stateName = 'Ogun';
  const countryId = new mongoose.Types.ObjectId();
  const body = { name: stateName, countryId };

  const expectedResult = { name: stateName, countryId, _id: 'mockStateId' };

  describe('create-state-service', () => {
    it('should return created State if country exists', async () => {
      // Mock Country.findById to simulate that the country exists
      (Country.findById as jest.Mock).mockResolvedValueOnce(true);
      // Mock State.create to simulate state creation
      (State.create as jest.Mock).mockResolvedValueOnce(expectedResult);

      const result = await createState(body.name, body.countryId);

      expect(result).toStrictEqual(expectedResult);
      expect(Country.findById).toHaveBeenCalledWith(countryId);
      expect(Country.findById).toHaveBeenCalledTimes(1);
      expect(State.create).toHaveBeenCalledWith(body);
      expect(State.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if country does not exist', async () => {
      // Mock Country.findById to simulate country does not exist
      (Country.findById as jest.Mock).mockResolvedValueOnce(null);

      // Use a string for error comparison only if the message is precisely matched
      await expect(createState(stateName, countryId)).rejects.toThrow(
        new Error('Country not found'),
      );
    });
  });
});

//Test delete a state
describe('deleteStateService', () => {
  it('should delete a state', async () => {
    const moockStateId = 'id';

    // mock the find sate method to return mock countries
    (State.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

    // Call the service
    await deleteStateService(moockStateId);

    expect(State.findByIdAndDelete).toHaveBeenCalledTimes(1);
  });
});

describe('updateStateService', () => {
  const mockState: IState = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: 'Lagos',
    countryId: new mongoose.Types.ObjectId(),
  } as IState;
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the updated state if it exists', async () => {
    // Mock the findById method to return the mock state
    (State.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(mockState);

    const result = await updateStateService(mockState._id as string, mockState);

    // Assert: Check if the service returns the correct data
    expect(result).toEqual(mockState);
    expect(State.findByIdAndUpdate).toHaveBeenCalledWith(
      mockState._id,
      mockState,
      { new: true, runValidators: true },
    );
    expect(State.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('should return null if the state does not exist', async () => {
    const validNonexistentId = new mongoose.Types.ObjectId().toString();

    // Mock the findById method to return null
    (State.findById as jest.Mock).mockResolvedValue(null);

    const result = await updateStateService(validNonexistentId, mockState);

    // Assert: Check if the service returns null when state is not found
    expect(result).toBeUndefined();
    expect(State.findByIdAndUpdate).toHaveBeenCalledWith(
      validNonexistentId,
      mockState,
      { new: true, runValidators: true },
    );
    expect(State.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if an invalid ID format is provided', async () => {
    const invalidId = 'invalid_id_format';

    // Call the service with the invalid ID and expect it to throw an error
    await expect(updateStateService(invalidId, mockState)).rejects.toThrow(
      'Invalid ID format',
    );
    expect(State.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const errorMessage = 'Database connection error';
    const validId = new mongoose.Types.ObjectId().toString();

    // Mock the findById method to throw an error
    (State.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    await expect(updateStateService(validId, mockState)).rejects.toThrow(
      errorMessage,
    );
    expect(State.findByIdAndUpdate).toHaveBeenCalledWith(validId, mockState, {
      new: true,
      runValidators: true,
    });
    expect(State.findByIdAndUpdate).toHaveBeenCalledTimes(1);
  });
});
