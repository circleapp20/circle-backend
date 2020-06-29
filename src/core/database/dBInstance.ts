import { SERVER } from 'base/config/server';
import { entities } from 'core/models/node/entities';
import * as typeorm from 'typeorm';

export const getSqlInstance = (name = 'default') => {
	let options: typeorm.ConnectionOptions = {
		type: 'mysql',
		url: SERVER.app.DATABASE_URL,
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
