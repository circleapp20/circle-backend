import faker from 'faker';

export const createLocationFixture = () => {
	return {
		name: faker.name.findName(),
		address: faker.address.secondaryAddress(),
		latitude: faker.random.number(),
		longitude: faker.random.number()
	};
};
