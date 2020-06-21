import { BaseModel } from './baseModel';
import { Fellows } from './fellows';
import { Locations } from './locations';

export class Users extends BaseModel {
	name: string;
	username: string;
	password: string;
	dob: Date;
	image: string;
	biography: string;
	email: string;
	phoneNumber: string;
	verificationCode: string;
	roles: string[];
	locations: Locations[];
	fellow: Fellows;
}
