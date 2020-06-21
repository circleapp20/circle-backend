import { getBadRequestError } from 'base/common/errors';
import { Constants } from 'base/constants';
import { getUserByIdQuery } from 'base/node/queries';
import bcryptjs from 'bcryptjs';
import { runInTransaction, runQuery } from 'core/node/database/queryRunners';
import { countUsersMatchingSearchQuery } from 'feature/users/queries/countUsersQueries';
import {
	addUserLocationsQuery,
	updateUserProfileQuery
} from 'feature/users/queries/updateUserQueries';
import { IAddUserLocation, IUpdateUserProfile } from 'feature/users/queries/updateUserTypes';
import { uploadUserProfileImage } from 'feature/users/uploads/node/uploadUserProfileImage';
import { EntityManager } from 'typeorm';

type UpdateUser = IUpdateUserProfile & IAddUserLocation;

export const updateUserTransaction = (data: UpdateUser) => {
	const { locationsId, id, ...rest } = data;
	const password = bcryptjs.hashSync(data.password, 12);
	return async (manager: EntityManager) => {
		const profile = Object.assign({}, rest, { password, id });
		await runQuery(updateUserProfileQuery, [profile], manager);
		// add user locations
		if (locationsId.length) {
			await runQuery(addUserLocationsQuery, [{ locationsId, id }], manager);
		}
		return runQuery(getUserByIdQuery, [data.id], manager);
	};
};

export const updateUserProfile = async (data: UpdateUser) => {
	const { username, id, password: rawPassword, image, email, phoneNumber } = data;
	if (!id) throw getBadRequestError('id is required');

	if (!rawPassword) throw getBadRequestError('password is required');

	const count = await runQuery(countUsersMatchingSearchQuery, [{ username, id }]);
	if (count !== 1) throw getBadRequestError('username already exists');

	if (phoneNumber) {
		const total = await runQuery(countUsersMatchingSearchQuery, [{ phoneNumber, id }]);
		if (total !== 1) throw getBadRequestError('phone number already exists');
	}

	if (email) {
		const total = await runQuery(countUsersMatchingSearchQuery, [{ email, id }]);
		if (total !== 1) throw getBadRequestError('email already exists');
	}

	// upload image to firebase storage bucket
	const downloadURL = await uploadUserProfileImage(id, image);

	const profile = Object.assign({}, data, { image: downloadURL });

	const user: any = await runInTransaction(updateUserTransaction(profile));
	const { password, ...other } = user;

	return other;
};

export const updateUserPassword = async (id: string, password: string) => {
	const user = await runQuery(getUserByIdQuery, [id]);
	if (!user) throw getBadRequestError('Invalid user account');

	if (bcryptjs.compareSync(password, user.password)) {
		throw getBadRequestError('Cannot enter the same password');
	}

	const hashedPassword = bcryptjs.hashSync(password, Constants.misc.BCRYPT_HASHING_SALT);

	await runQuery(updateUserProfileQuery, [{ id, password: hashedPassword }]);

	return true;
};
