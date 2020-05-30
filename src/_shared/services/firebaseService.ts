import * as admin from 'firebase-admin';
import ServiceAccountKey from '../configs/service-account-key.json';
import { Constants } from '../constants';

let firebaseApp: admin.app.App | null = null;

export const getFirebaseAppInstance = () => {
	if (!firebaseApp) {
		firebaseApp = admin.initializeApp({
			credential: admin.credential.cert(ServiceAccountKey as admin.ServiceAccount),
			databaseURL: Constants.externals.FIREBASE_DATABASE_URL,
			storageBucket: Constants.externals.FIREBASE_STORAGE_BUCKET
		});
	}

	return firebaseApp;
};

export const getStorageBucket = () => {
	const app = getFirebaseAppInstance();
	return app.storage().bucket();
};
