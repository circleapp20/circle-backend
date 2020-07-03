import { SERVER } from 'base/config/server';
import { entityManager } from 'base/testUtils/node/entityManager';
import { runInTransaction } from 'core/database/queryRunners';
import faker from 'faker';
import * as addLocationQueries from 'feature/locations/queries/addLocationQuery';
import * as getLocationQueries from 'feature/locations/queries/getLocationQueries';
import {
	addLocationService,
	addLocationTransaction
} from 'feature/locations/services/node/addLocationService';
import { createLocationFixture } from 'fixtures/locations';

jest.mock('core/database/queryRunners');
jest.mock('core/models/node/locations');

beforeEach(() => jest.clearAllMocks());

describe('#addLocationTransaction', () => {
	const location = createLocationFixture();
	const placeId = faker.random.uuid();
	const locationId = faker.random.uuid();
	let runTransaction: any;

	beforeEach(() => {
		entityManager.execute.mockReturnValueOnce({
			generateMaps: [{ ...location, id: locationId }]
		});
		runTransaction = addLocationTransaction(Object.assign({}, location, { placeId }));
	});

	test('should add a new location', async () => {
		const spy = jest.spyOn(addLocationQueries, 'addLocationQuery');
		await runTransaction(entityManager);
		expect(spy).toHaveBeenCalledWith(entityManager, location);
	});

	test('should relate location with place', async () => {
		const spy = jest.spyOn(addLocationQueries, 'addLocationPlaceQuery');
		await runTransaction(entityManager);
		expect(spy).toHaveBeenCalledWith(entityManager, { id: locationId, placeId });
	});

	test('should return newly added location', async () => {
		const spy = jest.spyOn(getLocationQueries, 'getLocationByIdQuery');
		await runTransaction(entityManager);
		expect(spy).toHaveBeenCalledWith(entityManager, locationId);
	});

	test('should not relate location with place if placeId is empty', async () => {
		const spy = jest.spyOn(addLocationQueries, 'addLocationPlaceQuery');
		const transaction = addLocationTransaction({ ...location, placeId: '' });
		await transaction(entityManager);
		expect(spy).not.toHaveBeenCalled();
	});
});

describe('#addLocation', () => {
	const location = createLocationFixture();
	const placeId = faker.random.uuid();

	beforeEach(() => {
		entityManager.execute.mockReturnValueOnce({
			generateMaps: [{ ...location, id: faker.random.uuid() }]
		});
	});

	test('should run queries in transaction', async () => {
		await addLocationService({ ...location, placeId }, [SERVER.privileges.LEAD_FELLOW]);
		expect(runInTransaction).toHaveBeenCalled();
	});

	test('should set isVerified to true if user has lead role', async () => {
		await addLocationService({ ...location, placeId }, [SERVER.privileges.LEAD_FELLOW]);
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({ isVerified: true })
		);
	});

	test('should set isVerified to false if user does not have lead role', async () => {
		await addLocationService({ ...location, placeId }, [SERVER.privileges.FELLOW]);
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({ isVerified: false })
		);
	});
});
