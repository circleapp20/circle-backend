import faker from 'faker';

export const createLocationFixture = () => {
	return {
		name: faker.name.findName(),
		address: faker.address.secondaryAddress(),
		latitude: faker.random.number(),
		longitude: faker.random.number()
	};
};

export const locationsList = [
	{
		id: '84fa52ca-a661-4f73-8202-2fb5ae166bf8',
		createdAt: '2020-06-20T15:30:58.957Z',
		updatedAt: '2020-06-20T15:30:58.957Z',
		name: 'Ghana',
		latitude: 6.973,
		longitude: 127.398,
		address: '',
		isVerified: false,
		places: [
			{
				id: 'f039103d-8524-433f-9986-7535c9222464',
				createdAt: '2020-06-20T15:31:29.641Z',
				updatedAt: '2020-06-20T15:31:29.000Z',
				name: 'Ashanti',
				latitude: 6.973,
				longitude: 127.398,
				address: '',
				isVerified: false,
				places: [
					{
						id: '7a530166-0f77-4528-bbd3-cfa355bed328',
						createdAt: '2020-06-20T15:32:13.935Z',
						updatedAt: '2020-06-20T15:32:13.000Z',
						name: 'Kumasi',
						latitude: 6.973,
						longitude: 127.398,
						address: '',
						isVerified: false,
						places: []
					}
				]
			},
			{
				id: '81f6240f-4fbd-4f10-856c-f9715ae1da8a',
				createdAt: '2020-06-20T22:05:52.398Z',
				updatedAt: '2020-06-20T22:05:52.000Z',
				name: 'Greater Accra',
				latitude: 6.973,
				longitude: 127.398,
				address: '',
				isVerified: false,
				places: []
			}
		]
	},
	{
		id: '0ff59483-a02c-444c-baf1-42b2a443392c',
		createdAt: '2020-06-20T22:04:25.119Z',
		updatedAt: '2020-06-20T22:04:25.119Z',
		name: 'Togo',
		latitude: 6.973,
		longitude: 127.398,
		address: '',
		isVerified: false,
		places: []
	}
];
