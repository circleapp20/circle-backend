import { SERVER } from 'base/config/server';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import { addLocationService } from 'feature/locations/services/node/addLocationService';

export const addLocationHandler = async (request: IRequest, response: Response) => {
	const { roles } = request.user;
	const location = await addLocationService(request.body.data, roles);
	const { places, ...other } = location!;
	const data = getResponseData(other);
	response.status(SERVER.status.CREATED).json(data);
};
