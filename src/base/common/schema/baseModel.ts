import * as typeorm from 'typeorm';

export class BaseModel {
	@typeorm.PrimaryGeneratedColumn('uuid')
	readonly id: string;

	@typeorm.CreateDateColumn()
	readonly createdAt: Date;

	@typeorm.UpdateDateColumn()
	updatedAt: Date;
}
