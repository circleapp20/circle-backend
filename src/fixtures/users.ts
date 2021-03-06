import { SERVER } from 'base/config/server';
import faker from 'faker';

export const createUserFixture = () => {
	return {
		id: faker.random.uuid(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		name: faker.name.findName(),
		username: faker.internet.userName(),
		password: faker.internet.password(),
		dob: faker.date.past(),
		image: faker.image.image(),
		biography: faker.random.words(),
		email: faker.internet.email(),
		phoneNumber: faker.phone.phoneNumber(),
		verificationCode: faker.random.uuid().slice(0, 6),
		roles: [SERVER.privileges.USER]
	};
};
