import { BaseModel } from 'core/models/node/baseModel';
import { Users } from 'core/models/node/users';
import * as typeorm from 'typeorm';

@typeorm.Entity()
export class Fellows extends BaseModel {
	@typeorm.Column({ nullable: false })
	secretCode: string;

	@typeorm.OneToOne(() => Users, (user) => user.fellow)
	@typeorm.JoinColumn()
	user: Users;
}
