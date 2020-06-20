import { BaseModel } from './baseModel';
import { Users } from './users';

export class Fellows extends BaseModel {
	secretCode: string;
	user: Users;
}
