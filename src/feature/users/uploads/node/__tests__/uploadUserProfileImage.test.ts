import { uploadUserProfileImage } from '../uploadUserProfileImage';

jest.mock('firebase-admin', () => ({
	initializeApp: jest.fn().mockReturnValue({
		storage: jest.fn().mockReturnValue({
			bucket: jest.fn().mockReturnValue({
				file: jest.fn().mockReturnValue({
					save: jest.fn((_, __, callback) => callback())
				})
			})
		})
	}),
	credential: {
		cert: jest.fn().mockReturnValue({})
	}
}));

describe('#uploadUserProfileImage', () => {
	test('should return an empty string if image is undefined', async () => {
		const url = await uploadUserProfileImage('sx5iw0932', '');
		expect(url).toBe('');
	});

	test('should return a url for the uploaded image', async () => {
		const url = await uploadUserProfileImage(
			'o303lkf5jo3',
			'data:image/png;base64,/9j/4RiDRXhpZgAATU0AKgA'
		);
		expect(url).not.toBe('');
	});

	test('should return empty string if id is undefined or empty', async () => {
		const url = await uploadUserProfileImage(
			'',
			'data:image/png;base64,/9j/4RiDRXhpZgAATU0AKgA'
		);
		expect(url).toBe('');
	});
});
