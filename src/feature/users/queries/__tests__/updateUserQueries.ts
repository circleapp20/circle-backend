import { Users } from 'base/common/schema/users';
import { entityManager } from 'base/testUtils/node/entityManager';
import faker from 'faker';
import { addUserLocationsQuery, updateUserProfileQuery } from '../updateUserQueries';
import { IUpdateUserProfile } from '../updateUserTypes';

jest.mock('base/common/schema/users');

beforeEach(() => jest.clearAllMocks());

describe('#updateUserProfileQuery', () => {
	const values: IUpdateUserProfile = {
		username: 'ghEi39',
		password: '039mdi39k3903jdm933kr93',
		dob: new Date(),
		image: '',
		biography: '',
		id: '93i49m-3jd8k',
		name: 'testName',
		email: '',
		phoneNumber: ''
	};

	test('should call the query builder on the Users table', async () => {
		await updateUserProfileQuery(entityManager, values);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith();
	});

	test('should call update query builder on the Users table', async () => {
		await updateUserProfileQuery(entityManager, values);
		expect(entityManager.update).toHaveBeenCalledWith(Users);
	});

	test('should call set with new values for user expect the id', async () => {
		await updateUserProfileQuery(entityManager, values);
		expect(entityManager.set).not.toHaveBeenCalledWith(
			expect.objectContaining({ id: expect.any(String) })
		);
	});

	test('should only update user matching the id', async () => {
		await updateUserProfileQuery(entityManager, values);
		expect(entityManager.where).toHaveBeenLastCalledWith('id = :id', { id: values.id });
	});
});

describe('#addUserLocationsQuery', () => {
	let values: any;

	beforeAll(() => {
		values = {
			id: faker.random.uuid(),
			locationsId: Array(5).fill(null).map(faker.random.uuid)
		};
	});

	test('should create a query builder', async () => {
		await addUserLocationsQuery(entityManager, values);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith();
	});

	test('should create a relation between users schema and locations', async () => {
		await addUserLocationsQuery(entityManager, values);
		expect(entityManager.relation).toHaveBeenCalledWith(Users, 'locations');
	});

	test('should add the relation to the user id', async () => {
		await addUserLocationsQuery(entityManager, values);
		expect(entityManager.of).toHaveBeenCalledWith(values.id);
	});

	test('should relate user to multiple locations by ids', async () => {
		await addUserLocationsQuery(entityManager, values);
		expect(entityManager.add).toHaveBeenCalledWith(values.locationsId);
	});
});
