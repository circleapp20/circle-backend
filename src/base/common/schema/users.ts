import * as typeorm from 'typeorm';
import { BaseModel } from './baseModel';
import { Fellows } from './fellows';
import { Locations } from './locations';

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
}
