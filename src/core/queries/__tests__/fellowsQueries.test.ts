import { entityManager } from 'base/testUtils/node/entityManager';
import { Fellows } from 'core/models/node/fellows';
import { addUserToFellowsQuery } from 'core/queries/fellowQueries';

jest.mock('core/models/node/fellows');
jest.mock('core/models/node/users');

describe('#addUserToFellowsQuery', () => {
	const data = { id: 'os83mc28', secretCode: 'secret' };

	test('should return undefined if id is invalid', async () => {
		await addUserToFellowsQuery(entityManager, { id: '', secretCode: '' });
		expect(entityManager.createQueryBuilder).not.toHaveBeenCalled();
	});

	test('should not call createQueryBuilder with invalid secretCode', async () => {
		await addUserToFellowsQuery(entityManager, { id: 'os83mc28', secretCode: '' });
		expect(entityManager.createQueryBuilder).not.toHaveBeenCalled();
	});

	test('should create a query with fellow as alias for Fellows schema', async () => {
		await addUserToFellowsQuery(entityManager, data);
		expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Fellows, 'fellow');
	});

	test('should call the insert on the query builder', async () => {
		await addUserToFellowsQuery(entityManager, data);
		expect(entityManager.insert).toHaveBeenCalled();
	});

	test('should pass the user id and secretCode to the values function of insert', async () => {
		await addUserToFellowsQuery(entityManager, data);
		expect(entityManager.values).toHaveBeenCalledWith(
			expect.objectContaining({ user: { id: 'os83mc28' }, secretCode: 'secret' })
		);
	});

	test('should return the executed insert query', async () => {
		await addUserToFellowsQuery(entityManager, data);
		expect(entityManager.execute).toHaveBeenCalled();
	});
});
