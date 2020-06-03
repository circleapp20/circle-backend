export const entityManagerMock: any = {
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
	orWhere: jest.fn().mockReturnThis()
};
