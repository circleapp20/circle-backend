jest.requireMock('typeorm');

export class BaseModel {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export class Users extends BaseModel {
	username: string;
	password: string;
	dob: Date;
	image: string;
	biography: string;
	email: string;
	phoneNumber: string;
	verificationCode: string;
}

export class Campuses extends BaseModel {
	name: string;
	latitude: number;
	longitude: number;
}

export default [Users, Campuses];
