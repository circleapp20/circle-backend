import { Locations } from 'base/common/schema/locations';
import { entityManager } from 'base/testUtils/node/entityManager';
import faker from 'faker';
import { getLocationByIdQuery } from '../getLocationByIdQuery';

jest.mock('base/common/schema/locations');

beforeEach(() => jest.clearAllMocks());

describe('#getLocationByIdQuery', () => {
	const id = faker.random.uuid();

	test('should create a query builder with Locations schema', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Locations, 'locations');
	});

	test('should add states with left join to the query', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.leftJoinAndSelect).toHaveBeenNthCalledWith(
			1,
			'locations.places',
			'states'
		);
	});

	test('should add cities to states with left join in the query', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.leftJoinAndSelect).toHaveBeenNthCalledWith(
			2,
			'states.places',
			'cities'
		);
	});

	test('should add streets to cities query', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.leftJoinAndSelect).toHaveBeenLastCalledWith(
			'cities.places',
			'streets'
		);
	});

	test('should search query with location id', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.where).toHaveBeenCalledWith('locations.id = :id', { id });
	});

	test('should return only a single result', async () => {
		await getLocationByIdQuery(entityManager, id);
		expect(entityManager.getOne).toHaveBeenCalledWith();
	});
});
