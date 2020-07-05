import { SERVER } from 'base/config/server';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import { getStores } from 'feature/stores/services/node/getStoresInfo';

export const getStoresHandler = async (_: IRequest, res: Response) => {
	const stores = await getStores();
	const response = getResponseData(stores);
	res.status(SERVER.status.SUCCESS).json(response);
};
