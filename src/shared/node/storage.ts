import * as admin from 'firebase-admin';
import { getMetaDataFromDataURI } from 'shared/common/utilities';
import { Constants } from 'shared/constants';
import { getSignedAuthToken } from 'shared/node/validation';
import { v4 } from 'uuid';
import ServiceAccountKey from './configs/service-account-key.json';

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

export const getFileDownloadURL = (urlPath: string, id: string) => {
	const encodedURI = encodeURIComponent(urlPath);
	const { name } = getStorageBucket();
	return `https://firebasestorage.googleapis.com/v0/b/${name}/o/${encodedURI}?alt=media&token=${id}`;
};

export const saveFileToBucket = (filename: string, buffer: Buffer, contentType: string) => {
	return new Promise<string>((resolve, reject) => {
		// generate firebase download token
		const token = getSignedAuthToken(v4());

		// Upload the image to the bucket
		const bucket = getStorageBucket();
		const file = bucket.file(filename);

		file.save(
			buffer,
			{
				metadata: {
					contentType,
					metadata: { firebaseStorageDownloadTokens: token }
				}
			},
			(error) => {
				if (error) return reject(error);
				else resolve(getFileDownloadURL(filename, token));
			}
		);
	});
};

export const uploadImageToFirebaseStorage = async (data: string, filename: string) => {
	const { uri, contentType } = getMetaDataFromDataURI(data);
	const buffer = Buffer.from(uri, 'base64');
	const url = await saveFileToBucket(filename, buffer, contentType);
	return url;
};
