import { entityManager } from 'base/testUtils/node/entityManager';
import * as query from 'feature/locations/queries/getLocationQueries';
import { getCircleLocations } from 'feature/locations/services/node/getLocationsService';
import { locationsList } from 'fixtures/locations';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/locations');

beforeEach(() => jest.clearAllMocks());

describe('#getCircleLocations', () => {
	let spy: any;

	beforeAll(() => {
		spy = jest.spyOn(query, 'getLocationsQuery');
	});

	beforeEach(() => {
		entityManager.getMany.mockReturnValueOnce(locationsList);
	});

	test('should run getLocationsQuery', async () => {
		await getCircleLocations();
		expect(spy).toHaveBeenCalled();
	});

	test('should pass entityManager to getLocationsQuery', async () => {
		await getCircleLocations();
		expect(spy).toHaveBeenCalledWith(entityManager);
	});
});
