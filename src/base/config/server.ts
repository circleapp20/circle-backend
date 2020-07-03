import { CONSTANTS as SharedConstants } from 'base/config/common/constants';
import dotenv from 'dotenv';

dotenv.config();

export const SERVER = {
	...SharedConstants,
	app: {
		PORT: process.env.PORT || 4000,
		DATABASE_URL: process.env.DATABASE_URL,
		MAIL_USER: process.env.MAIL_USER,
		MAIL_PASSWORD: process.env.MAIL_PASSWORD,
		SECRET: process.env.CIRCLE_SECRET_KEY as string,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		GOOGLE_CLIENT_REFRESH_TOKEN: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
		MNOTIFY_API_KEY: process.env.MNOTIFY_API_KEY,
		MNOTIFY_SENDER_ID: 'CircleApp',
		FIREBASE_CREDENTIALS: JSON.parse(process.env.FIREBASE_CREDENTIALS as any)
	},
	accounts: {
		EMAIL_ADDRESS: 'circleapp20@gmail.com'
	},
	misc: {
		NODE_ENV: process.env.NODE_ENV,
		BCRYPT_HASHING_SALT: 12
	},
	externals: {
		FIREBASE_DATABASE_URL: 'https://circle-backend-92fb6.firebaseio.com',
		FIREBASE_STORAGE_BUCKET: 'circle-backend-92fb6.appspot.com',
		OAUTH2_REDIRECT_URL: 'https://developers.google.com/oauthplayground'
	},
	services: {
		SMS: 'https://api.mnotify.com/api'
	}
};
