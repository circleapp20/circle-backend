export const entityManager: any = {
	getRepository: jest.fn().mockReturnThis(),
	createQueryBuilder: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	getOne: jest.fn(),
	insert: jest.fn().mockReturnThis(),
	values: jest.fn().mockReturnThis(),
	execute: jest.fn().mockReturnValue({
		generatedMaps: []
	}),
	getCount: jest.fn(),
	andWhere: jest.fn().mockReturnThis(),
	update: jest.fn().mockReturnThis(),
	set: jest.fn().mockReturnThis(),
	orWhere: jest.fn().mockReturnThis(),
	setParameter: jest.fn().mockReturnThis(),
	limit: jest.fn().mockReturnThis(),
	connection: {
		synchronize: jest.fn()
	},
	relation: jest.fn().mockReturnThis(),
	of: jest.fn().mockReturnThis(),
	add: jest.fn(),
	leftJoinAndSelect: jest.fn().mockReturnThis()
};
