import { runQuery } from 'core/node/database/queryRunners';
import {
	countMatchingEmailQuery,
	countMatchingUsernameQuery
} from 'feature/users/queries/countUsersQueries';

export const checkUsernameOrEmailExists = async (username: string, email: string) => {
	const totalMatchingUsernameCount = !username
		? 0
		: await runQuery(countMatchingUsernameQuery, [username]);
	const totalMatchingEmailCount = !email ? 0 : await runQuery(countMatchingEmailQuery, [email]);
	return {
		username: Boolean(totalMatchingUsernameCount),
		email: Boolean(totalMatchingEmailCount)
	};
};
