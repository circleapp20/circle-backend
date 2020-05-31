import * as admin from 'firebase-admin';
import ServiceAccountKey from '../../configs/service-account-key.json';
import { Constants } from '../../constants';
import * as firebaseService from '../firebaseService';
import {
	getFileDownloadURL,
	getFirebaseAppInstance,
	getStorageBucket,
	saveFileToBucket,
	uploadImageToFirebaseStorage
} from '../firebaseService';

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

		bucketMock = jest.spyOn(firebaseService, 'getStorageBucket');
		bucketMock.mockReturnValue({
			name: 'circle-backend-92fb6',
			file: fileMock
		});
	});

	afterAll(() => {
		bucketMock.mockRestore();
	});

	describe('#getFirebaseAppInstance', () => {
		test('should call cert with service account key', () => {
			getFirebaseAppInstance();
			expect(admin.credential.cert).toHaveBeenCalledWith(ServiceAccountKey);
		});

		test('should call initializeApp with credential and databaseURL', () => {
			getFirebaseAppInstance();
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
			const app = getFirebaseAppInstance();
			expect(app).toBeDefined();
		});
	});

	describe('#getFileDownloadURL', () => {
		test('should return a url', () => {
			const token = 'di493mc-4ufm43r-u4m';
			const urlPath = '/users/si9n395-9n99n33fm9/profile1';
			const downloadURL = getFileDownloadURL(urlPath, token);
			expect(() => new URL(downloadURL)).not.toThrow();
		});
	});

	describe('#saveFileToBucket', () => {
		test('should call bucket.file with the filename', async () => {
			const buffer: any = 'ak2sn6foi8ne';
			const filename = '/images/users/profile-image-v1';
			await saveFileToBucket(filename, buffer, 'image/jpeg');
			expect(fileMock).toHaveBeenCalledWith(filename);
		});

		test('should call file.save with file buffer and metadata', async () => {
			const buffer: any = 'ak2sn6foi8ne';
			await saveFileToBucket('/images/users/profile-image-v1', buffer, 'image/jpeg');
			expect(saveMock).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					metadata: expect.objectContaining({
						contentType: expect.stringMatching('image/jpeg'),
						metadata: expect.objectContaining({
							firebaseStorageDownloadTokens: expect.any(String)
						})
					})
				}),
				expect.any(Function)
			);
		});

		test('should return download url', async () => {
			const buffer: any = 'ak2sn6foi8ne';
			const url = await saveFileToBucket(
				'/images/users/profile-image-v1',
				buffer,
				'image/jpeg'
			);
			expect(() => new URL(url)).not.toThrow();
			expect(url).toEqual(expect.stringContaining('profile-image-v1'));
		});

		test('should throw error if file could not be saved', (done) => {
			saveMock.mockImplementationOnce((_, __, callback) => callback(new Error()));
			const buffer: any = 'ak2sn6foi8ne';
			saveFileToBucket('/images/users/profile-image-v1', buffer, 'image/jpeg').catch(
				(error) => {
					expect(error).toEqual(expect.any(Error));
					done();
				}
			);
		});
	});

	describe('#getStorageBucket', () => {
		test('should return a storage reference', () => {
			bucketMock.mockRestore();
			const storageRef = getStorageBucket();
			expect(storageRef).toBeDefined();
		});
	});

	describe('#uploadImageToFirebaseStorage', () => {
		test('should return downloadURL', async () => {
			const url = await uploadImageToFirebaseStorage(
				'data:image/png;base64,/9j/4RiDRXhpZgAATU0AKgA',
				'/images/users/393f98r/profile1'
			);
			expect(() => new URL(url)).not.toThrow();
		});

		test('should return downloadURL for png images', async () => {
			const url = await uploadImageToFirebaseStorage(
				'/9j/4RiDRXhpZgAATU0AKgA',
				'/images/users/393f98r/profile1'
			);
			expect(() => new URL(url)).not.toThrow();
		});
	});
});
