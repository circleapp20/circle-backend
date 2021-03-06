import { entityManager } from 'base/testUtils/node/entityManager';
import { Locations } from 'core/models/node/locations';
import { getLocationsQuery } from 'feature/locations/queries/getLocationQueries';

jest.mock('core/models/node/locations');

beforeEach(() => jest.clearAllMocks());

describe('#getLocationsQuery', () => {
	test('should create query builder for locations schema', async () => {
		await getLocationsQuery(entityManager);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Locations, 'locations');
	});

	test('should add states with left join to the query', async () => {
		await getLocationsQuery(entityManager);
		expect(entityManager.leftJoinAndSelect).toHaveBeenNthCalledWith(
			1,
			'locations.places',
			'states'
		);
	});

	test('should add cities to states with left join in the query', async () => {
		await getLocationsQuery(entityManager);
		expect(entityManager.leftJoinAndSelect).toHaveBeenNthCalledWith(
			2,
			'states.places',
			'cities'
		);
	});

	test('should add streets to cities query', async () => {
		await getLocationsQuery(entityManager);
		expect(entityManager.leftJoinAndSelect).toHaveBeenLastCalledWith(
			'cities.places',
			'streets'
		);
	});

	test('should return an array of locations', async () => {
		await getLocationsQuery(entityManager);
		expect(entityManager.getMany).toHaveBeenCalled();
	});
});
