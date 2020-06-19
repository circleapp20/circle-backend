import { BaseModel } from './baseModel';
import { Users } from './users';

export class Locations extends BaseModel {
	name: string;
	latitude: number;
	longitude: number;
	address: string;
	isVerified: boolean;
	place: Locations;
	places: Locations[];
	user: Users;
}
