import { Users } from '../../../_shared/services';
import { entityManagerMock as entityManager } from '../../../__testSetup__';
import { getUserByIdQuery } from '../dataService';

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
});
