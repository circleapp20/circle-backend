export const entityManagerMock: any = {
	getRepository: jest.fn().mockReturnThis(),
	createQueryBuilder: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	getOne: jest.fn().mockReturnThis(),
	insert: jest.fn().mockReturnThis(),
	values: jest.fn().mockReturnThis(),
	execute: jest.fn().mockReturnValue({
		generatedMaps: []
	})
};
