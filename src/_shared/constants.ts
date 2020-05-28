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
		MAIL_SERVICE: 'gmail',
		MAIL_USER: process.env.MAIL_USER,
		MAIL_PASSWORD: process.env.MAIL_PASSWORD,
		SECRET: '02gv8989je9n8209nj089a089hq39t4v09'
	},
	accounts: {
		EMAIL_ADDRESS: 'circleapp20@gmail.com'
	},
	status: { ...Status }
};
