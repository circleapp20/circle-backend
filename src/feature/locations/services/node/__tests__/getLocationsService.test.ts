import { entityManager } from 'base/testUtils/node/entityManager';
import * as query from 'feature/locations/queries/getLocationQueries';
import { locationsList } from 'fixtures/locations';
import { getCircleLocations } from '../getLocationsService';

jest.mock('core/node/database/queryRunners');
jest.mock('base/common/schema/locations');

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
