import dotenv from 'dotenv';

dotenv.config();

const Status = {
	SUCCESS: 200,
	CREATED: 201,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	BAD_REQUEST: 400,
	SERVER_ERROR: 500,
	UNAUTHORIZED: 401
};

export const Constants = {
	app: {
		PORT: process.env.PORT || 4000,
		DATABASE_URL: process.env.DATABASE_URL,
		MAIL_USER: process.env.MAIL_USER,
		MAIL_PASSWORD: process.env.MAIL_PASSWORD,
		SECRET: '02gv8989je9n8209nj089a089hq39t4v09',
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
		GOOGLE_CLIENT_REFRESH_TOKEN: process.env.GOOGLE_CLIENT_REFRESH_TOKEN
	},
	accounts: {
		EMAIL_ADDRESS: 'circleapp20@gmail.com'
	},
	status: { ...Status },
	privileges: {
		SUPER_ADMIN: 'super_admin',
		USER: 'user'
	},
	misc: {
		NODE_ENV: process.env.NODE_ENV
	},
	externals: {
		FIREBASE_DATABASE_URL: 'https://circle-backend-92fb6.firebaseio.com',
		FIREBASE_STORAGE_BUCKET: 'circle-backend-92fb6.appspot.com',
		OAUTH2_REDIRECT_URL: 'https://developers.google.com/oauthplayground'
	}
};
