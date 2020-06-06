import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { Constants } from '../../constants';
import { addUserProfileQuery, getUserByCredentialsQuery, getUserByIdQuery } from '../dataService';
import { IAddUserProfile } from '../typeService';

jest.mock('../schemaService');

describe('#dataService', () => {
	describe('#getUserByIdQuery', () => {
		const id = 'dec2ace6-4fd2-4386-b75a-eabbcf0efa77';

		test('should create query builder from Users with the id', async () => {
			await getUserByIdQuery(entityManager, id);
			expect(entityManager.createQueryBuilder).toHaveBeenCalledWith(Users, 'u');
		});

		test('should match user id with id in the where clause', async () => {
			await getUserByIdQuery(entityManager, id);
			expect(entityManager.where).toHaveBeenCalledWith('u.id = :id', { id });
		});

		test('should only get one matching user', async () => {
			await getUserByIdQuery(entityManager, id);
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

	describe('#addUserProfileQuery', () => {
		const profile: IAddUserProfile = {
			username: '',
			password: '',
			dob: new Date(),
			image: '',
			biography: '',
			email: '',
			phoneNumber: '',
			isEmailVerified: false,
			verificationCode: '',
			roles: [Constants.privileges.USER],
			name: ''
		};

		test('should be called with an entity manager', async () => {
			await addUserProfileQuery(entityManager, profile);
			expect(entityManager.insert).toHaveBeenCalledTimes(1);
			expect(entityManager.values).toHaveBeenCalledTimes(1);
			expect(entityManager.execute).toHaveBeenCalledTimes(1);
		});

		test('should call values with profile value', async () => {
			await addUserProfileQuery(entityManager, profile);
			expect(entityManager.values).toHaveBeenCalledWith(profile);
		});

		test('should return insert query results', async () => {
			const results = await addUserProfileQuery(entityManager, profile);
			expect(results).toEqual({ generatedMaps: [] });
		});
	});
});
