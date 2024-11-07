// src/services/__tests__/create-state.test.ts
import { createState, deleteStateService } from '../../services/state-service';
import { State } from '../../models/state';
import { Country } from '../../models/country';
import mongoose from 'mongoose';

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
