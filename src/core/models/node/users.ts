import { BaseModel } from 'core/models/node/baseModel';
import { Fellows } from 'core/models/node/fellows';
import { Locations } from 'core/models/node/locations';
import { Stores } from 'core/models/node/stores';
import * as typeorm from 'typeorm';

@typeorm.Entity()
export class Users extends BaseModel {
	@typeorm.Column()
	name: string;

	@typeorm.Column()
	username: string;

	@typeorm.Column()
	password: string;

	@typeorm.Column()
	dob: Date;

	@typeorm.Column('text', { default: '' })
	image: string;

	@typeorm.Column({ default: '' })
	biography: string;

	@typeorm.Column()
	email: string;

	@typeorm.Column()
	phoneNumber: string;

	@typeorm.Column()
	verificationCode: string;

	@typeorm.Column('simple-array')
	roles: string[];

	@typeorm.OneToMany(() => Locations, (location) => location.user)
	locations: Locations[];

	@typeorm.OneToOne(() => Fellows, (fellow) => fellow.user)
	fellow: Fellows;

	@typeorm.OneToMany(() => Stores, (store) => store.user)
	stores: Stores[];

	@typeorm.ManyToMany(() => Stores, (store) => store.followers)
	follows: Stores[];
}
