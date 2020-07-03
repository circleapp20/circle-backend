import { SERVER } from 'base/config/server';
import { entityManager } from 'base/testUtils/node/entityManager';
import { getLocationsHandler } from 'feature/locations/controllers/getLocationsHandler';
import { locationsList } from 'fixtures/locations';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/locations');

describe('#getLocationsHandler', () => {
	const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

	beforeEach(() => {
		entityManager.getMany.mockReturnValueOnce(locationsList);
	});

	test('should send response as 200', async () => {
		await getLocationsHandler({} as any, res);
		expect(res.status).toHaveBeenCalledWith(SERVER.status.SUCCESS);
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
