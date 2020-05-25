import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

export class BaseModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}

@Entity()
export class Users extends BaseModel {
	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	dob: Date;

	@Column({ default: '' })
	image: string;

	@Column({ default: '' })
	biography: string;

	@Column()
	email: string;

	@Column()
	phoneNumber: string;

	@Column({ default: false })
	isEmailVerified: boolean;

	@Column()
	verificationCode: string;
}

@Entity()
export class Campuses extends BaseModel {
	@Column()
	name: string;

	@Column('float', { default: 0 })
	latitude: number;

	@Column('float', { default: 0 })
	longitude: number;
}

export default [Users, Campuses];
