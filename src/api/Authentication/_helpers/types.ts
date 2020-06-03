export interface IAddUserProfile {
	username: string;
	password: string;
	dob: Date;
	image: string;
	biography: string;
	email: string;
	phoneNumber: string;
	isEmailVerified: boolean;
	verificationCode: string;
	roles: string[];
	name: string;
}
