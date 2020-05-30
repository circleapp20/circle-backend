import * as admin from 'firebase-admin';
import ServiceAccountKey from '../../configs/service-account-key.json';
import { Constants } from '../../constants';
import * as firebaseService from '../firebaseService';
import { getFirebaseAppInstance, getStorageBucket } from '../firebaseService';

jest.mock('firebase-admin', () => ({
	initializeApp: jest.fn().mockReturnValue({
		storage: jest.fn().mockReturnValue({
			bucket: jest.fn()
		})
	}),
	credential: {
		cert: jest.fn().mockReturnValue({})
	}
}));

describe('#firebaseService', () => {
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

	describe('#getStorageBucket', () => {
		let instanceMock: jest.SpyInstance<admin.app.App, []>;
		let storage: jest.Mock<any, any>;
		let bucket: jest.Mock<any, any>;

		beforeEach(() => {
			instanceMock = jest.spyOn(firebaseService, 'getFirebaseAppInstance');
			bucket = jest.fn();
			storage = jest.fn().mockImplementation(jest.fn()).mockReturnValue({
				bucket
			});
			(instanceMock.mockReturnValue as any)({ storage });
		});

		test('should call storage on app', () => {
			getStorageBucket();
			expect(storage).toHaveBeenCalledWith();
		});

		test('should call bucket on storage', () => {
			getStorageBucket();
			expect(bucket).toHaveBeenCalledWith();
		});
	});
});
