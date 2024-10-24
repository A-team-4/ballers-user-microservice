/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCountryService } from '../../services/country-service';
import { Country } from '../../models/country';

describe('create-country.ts', () => {
  const body = { name: 'Nigeria' };
  const expectedResult = { name: 'Nigeria', _id: 'aabbs', __v: 0 };

  describe('createCountryService', () => {
    it('should return created Country', async () => {
      jest
        .spyOn(Country, 'create')
        .mockResolvedValueOnce(expectedResult as any);

      expect(await createCountryService(body.name)).toStrictEqual(
        expectedResult,
      );
    });
  });
});
