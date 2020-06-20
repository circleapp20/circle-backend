import { entities } from 'base/common/schema/entities';
import { Constants } from 'base/constants';
import * as typeorm from 'typeorm';

export const getSqlInstance = (name = 'default') => {
	let options: typeorm.ConnectionOptions = {
		type: 'mysql',
		url: Constants.app.DATABASE_URL,
		name,
		entities
	};

	if (process.env.NODE_ENV === 'production') {
		options = Object.assign({}, options, {
			ssl: true,
			type: 'postgres',
			extra: { ssl: { rejectUnauthorized: false } }
		});
	}

	return typeorm.createConnection(options);
};
