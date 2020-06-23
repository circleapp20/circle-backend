import { Constants } from 'base/config/node/constants';
import { entityManager } from 'base/testUtils/node/entityManager';
import faker from 'faker';
import { addLocationHandler } from 'feature/locations/controllers/addLocationHandler';
import { createLocationFixture } from 'fixtures/locations';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/locations');

describe('#addLocationHandler', () => {
	const location = createLocationFixture();
	const request: any = {
		user: { roles: [Constants.privileges.FELLOW] },
		body: { data: { ...location, placeId: '' } }
	};
	const response: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

	beforeEach(() => {
		entityManager.execute.mockReturnValueOnce({ generateMaps: [location] });
		entityManager.getOne.mockReturnValueOnce(location);
	});

	test('should send a response of 201 when location is created', async () => {
		await addLocationHandler(request, response);
		expect(response.status).toHaveBeenCalledWith(201);
	});

	test('should send response of 201 when location created with placeId', async () => {
		entityManager.execute.mockReturnValueOnce({ generateMaps: [location] });
		const data = { ...location, placeId: faker.random.uuid() };
		const req = { ...request, body: { data } };
		await addLocationHandler(req, response);
		expect(response.status).toHaveBeenCalledWith(201);
	});
});
