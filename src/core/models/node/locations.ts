import * as typeorm from 'typeorm';
import { BaseModel } from './baseModel';
import { Users } from './users';

@typeorm.Entity()
export class Locations extends BaseModel {
	@typeorm.Column()
	name: string;

	@typeorm.Column('float', { default: 0 })
	latitude: number;

	@typeorm.Column('float', { default: 0 })
	longitude: number;

	@typeorm.Column()
	address: string;

	@typeorm.Column('boolean', { default: false })
	isVerified: boolean;

	@typeorm.ManyToOne(() => Locations, (location) => location.places)
	place: Locations;

	@typeorm.OneToMany(() => Locations, (location) => location.place)
	places: Locations[];

	@typeorm.ManyToOne(() => Users, (user) => user.locations)
	user: Users;
}
