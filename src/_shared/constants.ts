import dotenv from 'dotenv';

dotenv.config();

export const Constants = {
	app: {
		PORT: process.env.PORT || 4000,
		DATABASE_URL: process.env.DATABASE_URL,
		MAIL_SERVICE: 'gmail',
		MAIL_USER: process.env.MAIL_USER,
		MAIL_PASSWORD: process.env.MAIL_PASSWORD
	},
	accounts: {
		EMAIL_ADDRESS: 'circleapp20@gmail.com'
	}
};
