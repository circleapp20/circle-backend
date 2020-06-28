import { entityManager } from 'base/testUtils/node/entityManager';
import { Locations } from 'core/models/node/locations';
import faker from 'faker';
import {
	addLocationPlaceQuery,
	addLocationQuery
} from 'feature/locations/queries/addLocationQuery';
import { createLocationFixture } from 'fixtures/locations';

jest.mock('core/models/node/locations');

beforeEach(() => jest.clearAllMocks());

describe('#addLocationQuery', () => {
	const location = createLocationFixture();

	test('should create a query builder with Location schema', async () => {
		await addLocationQuery(entityManager, location);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Locations, 'location');
	});

	test('should add values to query builder', async () => {
		await addLocationQuery(entityManager, location);
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({
				name: location.name,
				address: location.address,
				latitude: location.latitude,
				longitude: location.longitude,
				isVerified: false
			})
		);
	});

	test('should execute the query builder', async () => {
		await addLocationQuery(entityManager, location);
		expect(entityManager.execute).toHaveBeenCalledWith();
	});

	test('should add isVerified to query', async () => {
		await addLocationQuery(entityManager, Object.assign({}, location, { isVerified: true }));
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({
				name: location.name,
				address: location.address,
				latitude: location.latitude,
				longitude: location.longitude,
				isVerified: true
			})
		);
	});
});

describe('#addLocationPlaceQuery', () => {
	const values = { id: faker.random.uuid(), placeId: faker.random.uuid() };

	test('should create a query builder', async () => {
		await addLocationPlaceQuery(entityManager, values);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith();
	});

	test('should create a relation for locations places', async () => {
		await addLocationPlaceQuery(entityManager, values);
		expect(entityManager.relation).toHaveBeenCalledWith(Locations, 'places');
	});

	test('should relate location to place by id', async () => {
		await addLocationPlaceQuery(entityManager, values);
		expect(entityManager.of).toHaveBeenCalledWith(values.placeId);
	});

	test('should add location id to place', async () => {
		await addLocationPlaceQuery(entityManager, values);
		expect(entityManager.add).toHaveBeenCalledWith(values.id);
	});
});
