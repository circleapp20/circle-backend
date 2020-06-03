import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { getUserByCredentialsQuery, getUserByIdQuery } from '../dataService';

jest.mock('../schemaService');

describe('#dataService', () => {
	describe('#getUserByIdQuery', () => {
		test('should create query builder from Users with the id', async () => {
			const id = 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77';
			await getUserByIdQuery(entityManager, id);
			expect(entityManager.getRepository).toHaveBeenCalledWith(Users);
			expect(entityManager.where).toHaveBeenCalledWith('id = :id', { id });
			expect(entityManager.getOne).toHaveBeenCalled();
		});
	});

	describe('#getUserByCredentialsQuery', () => {
		test('should search database with username if defined', async () => {
			const values = { username: 'username', phoneNumber: '', email: '' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.username = :username', {
				username: values.username
			});
		});

		test('should search users with phoneNumber', async () => {
			const values = { username: '', phoneNumber: '+1-422-847-4939', email: '' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.phoneNumber = :phoneNumber', {
				phoneNumber: values.phoneNumber
			});
		});

		test('should search users with email if defined', async () => {
			const values = { username: '', phoneNumber: '', email: 'test@test.com' };
			await getUserByCredentialsQuery(entityManager, values);
			expect(entityManager.where).toHaveBeenCalledWith('u.email = :email', {
				email: values.email
			});
		});
	});
});
