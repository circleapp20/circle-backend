import * as utils from 'base/common/utilities';
import { Constants } from 'base/constants';
import * as queries from 'base/node/queries';
import { entityManager } from 'base/testUtils/node/entityManager';
import * as encryption from 'core/node/encryption';
import { createUserFixture } from 'fixtures/users';
import { addUserAsSuperAdmin, createCircleSuperAdmin } from '../createSuperAdmin';
import { runInTransaction } from '../queryRunners';

jest.mock('base/common/schema/users');
jest.mock('base/common/schema/fellows');
jest.mock('core/node/database/queryRunners');

beforeEach(() => jest.clearAllMocks());

describe('#addUserAsSuperAdmin', () => {
	let user: any;

	beforeEach(() => {
		user = createUserFixture();
		entityManager.execute.mockReturnValueOnce({ generateMaps: [user] });
	});

	test('should add super admin to users table', async () => {
		const addQuerySpy = jest.spyOn(queries, 'addUserProfileQuery');
		await addUserAsSuperAdmin(entityManager);
		expect(addQuerySpy).toHaveBeenCalledWith(
			entityManager,
			expect.objectContaining({
				biography: expect.any(String),
				dob: expect.any(Date),
				email: expect.any(String),
				image: expect.any(String),
				isEmailVerified: true,
				name: expect.any(String),
				password: expect.any(String),
				phoneNumber: expect.any(String),
				roles: expect.arrayContaining([
					Constants.privileges.SUPER_ADMIN,
					Constants.privileges.USER,
					Constants.privileges.FELLOW,
					Constants.privileges.LEAD_FELLOW
				]),
				username: expect.any(String),
				verificationCode: expect.any(String)
			})
		);
	});

	test('should generate a secret code', async () => {
		const spy = jest.spyOn(utils, 'generateCodeFromNumber');
		await addUserAsSuperAdmin(entityManager);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	test('should encrypt the generated secret code', async () => {
		const encryptSpy = jest.spyOn(encryption, 'encryptData');
		await addUserAsSuperAdmin(entityManager);
		expect(encryptSpy).toHaveBeenLastCalledWith(
			expect.objectContaining({ text: expect.any(String) })
		);
	});

	test('should add user as a fellow', async () => {
		const spy = jest.spyOn(queries, 'addUserToFellowsQuery');
		await addUserAsSuperAdmin(entityManager);
		expect(spy).toHaveBeenCalledWith(
			entityManager,
			expect.objectContaining({
				id: expect.stringMatching(user.id),
				secretCode: expect.any(String)
			})
		);
	});
});

describe('#createCircleSuperAdmin', () => {
	test('should create a super admin if no super exists', async () => {
		const user = createUserFixture();
		entityManager.getCount.mockReturnValueOnce(0);
		entityManager.execute.mockReturnValueOnce({ generateMaps: [user] });
		await createCircleSuperAdmin();
		expect(runInTransaction).toHaveBeenCalled();
	});

	test('should not create super admin if at least one exists', async () => {
		entityManager.getCount.mockReturnValueOnce(1);
		await createCircleSuperAdmin();
		expect(runInTransaction).not.toHaveBeenCalled();
	});
});
