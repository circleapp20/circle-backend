import { BaseModel } from 'core/models/node/baseModel';
import { Locations } from 'core/models/node/locations';
import { Users } from 'core/models/node/users';
import * as typeorm from 'typeorm';

@typeorm.Entity()
export class Stores extends BaseModel {
	@typeorm.Column()
	name: string;

	@typeorm.Column()
	category: string;

	@typeorm.Column({ default: false })
	isVerified: boolean;

	@typeorm.ManyToOne(() => Locations, (location) => location.stores)
	location: Locations;

	@typeorm.ManyToOne(() => Users, (user) => user.stores)
	user: Users;

	@typeorm.ManyToMany(() => Users, (user) => user.follows)
	@typeorm.JoinTable()
	followers: Users[];
}
