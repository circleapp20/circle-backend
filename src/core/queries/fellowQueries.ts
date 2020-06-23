import { Fellows } from 'core/models/node/fellows';
import { EntityManager } from 'typeorm';

export const addUserToFellowsQuery = async (
	manager: EntityManager,
	values: { id: string; secretCode: string }
) => {
	const { id, secretCode } = values;
	if (!id || !secretCode) return;
	return manager
		.createQueryBuilder(Fellows, 'fellow')
		.insert()
		.values({ user: { id }, secretCode })
		.execute();
};
