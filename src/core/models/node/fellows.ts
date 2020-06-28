import * as typeorm from 'typeorm';
import { BaseModel } from './baseModel';
import { Users } from './users';

@typeorm.Entity()
export class Fellows extends BaseModel {
	@typeorm.Column({ nullable: false })
	secretCode: string;

	@typeorm.OneToOne(() => Users, (user) => user.fellow)
	@typeorm.JoinColumn()
	user: Users;
}
