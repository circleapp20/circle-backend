import { SERVER } from 'base/config/server';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import { addStore } from 'feature/stores/services/node/addStore';

export const addStoreHandler = async (req: IRequest, res: Response) => {
	const { id, roles } = req.user;

	const data = Object.assign({}, req.body.data, { userId: id });

	const store = await addStore(data, roles);

	const response = getResponseData(store);

	res.status(SERVER.status.CREATED).json(response);
};
