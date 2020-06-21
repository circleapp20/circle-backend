import { Constants } from 'base/constants';
import { entityManager } from 'base/testUtils/node/entityManager';
import { locationsList } from 'fixtures/locations';
import { getLocationsHandler } from '../getLocationsHandler';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/locations');

describe('#getLocationsHandler', () => {
	const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

	beforeEach(() => {
		entityManager.getMany.mockReturnValueOnce(locationsList);
	});

	test('should send response as 200', async () => {
		await getLocationsHandler({} as any, res);
		expect(res.status).toHaveBeenCalledWith(Constants.status.SUCCESS);
	});

	test('should send an array of locations', async () => {
		await getLocationsHandler({} as any, res);
		expect(res.json).toHaveBeenCalledWith(
			expect.objectContaining({
				data: expect.arrayContaining([]),
				success: true
			})
		);
	});
});
