import { BaseModel } from './baseModel';
import { Locations } from './locations';
import { Users } from './users';

export class Stores extends BaseModel {
	name: string;
	category: string;
	isVerified: boolean;
	location: Locations;
	user: Users;
	followers: Users[];
}
