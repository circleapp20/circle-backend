import { Constants } from 'base/constants';
import * as storage from 'base/node/storage';
import * as admin from 'firebase-admin';
import ServiceAccountKey from '../configs/service-account-key.json';

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

describe('#firebaseService', () => {
	let bucketMock: jest.SpyInstance<any, []>;
	let saveMock: jest.Mock;
	let fileMock: jest.Mock;

	beforeAll(() => {
		saveMock = jest.fn().mockImplementation((_, __, callback) => callback());
		fileMock = jest.fn().mockReturnValue({ save: saveMock });

		bucketMock = jest.spyOn(storage, 'getStorageBucket');
		bucketMock.mockImplementation(() => ({
			name: 'circle-backend-92fb6',
			file: fileMock
		}));
	});

	describe('#getFirebaseAppInstance', () => {
		test('should call cert with service account key', () => {
			storage.getFirebaseAppInstance();
			expect(admin.credential.cert).toHaveBeenCalledWith(ServiceAccountKey);
		});

		test('should call initializeApp with credential and databaseURL', () => {
			storage.getFirebaseAppInstance();
			expect(admin.initializeApp).toHaveBeenCalledWith(
				expect.objectContaining({
					credential: expect.anything(),
					databaseURL: expect.stringContaining(Constants.externals.FIREBASE_DATABASE_URL),
					storageBucket: expect.stringContaining(
						Constants.externals.FIREBASE_STORAGE_BUCKET
					)
				})
			);
		});

		test('should return instance of firebase app', () => {
			const app = storage.getFirebaseAppInstance();
			expect(app).toBeDefined();
		});
	});

	describe('#getFileDownloadURL', () => {
		test('should return a url', () => {
			const token = 'di493mc-4ufm43r-u4m';
			const urlPath = '/users/si9n395-9n99n33fm9/profile1';
			const downloadURL = storage.getFileDownloadURL(urlPath, token);
			expect(() => new URL(downloadURL)).not.toThrow();
		});
	});

	describe('#saveFileToBucket', () => {
		test('should return download url', async () => {
			const buffer: any = 'ak2sn6foi8ne';
			const url = await storage.saveFileToBucket(
				'/images/users/profile-image-v1',
				buffer,
				'image/jpeg'
			);
			expect(() => new URL(url)).not.toThrow();
			expect(url).toEqual(expect.stringContaining('profile-image-v1'));
		});
	});

	describe('#getStorageBucket', () => {
		test('should return a storage reference', () => {
			bucketMock.mockRestore();
			const storageRef = storage.getStorageBucket();
			expect(storageRef).toBeDefined();
		});
	});

	describe('#uploadImageToFirebaseStorage', () => {
		test('should return downloadURL', async () => {
			const url = await storage.uploadImageToFirebaseStorage(
				'data:image/png;base64,/9j/4RiDRXhpZgAATU0AKgA',
				'/images/users/393f98r/profile1'
			);
			expect(() => new URL(url)).not.toThrow();
		});

		test('should return downloadURL for png images', async () => {
			const url = await storage.uploadImageToFirebaseStorage(
				'/9j/4RiDRXhpZgAATU0AKgA',
				'/images/users/393f98r/profile1'
			);
			expect(() => new URL(url)).not.toThrow();
		});
	});
});
