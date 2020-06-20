import { getResponseData } from 'base/common/utilities';
import { Constants } from 'base/constants';
import { IRequest } from 'base/types';
import { Response } from 'express';
import { addLocationService } from '../services/node/addLocationService';

export const addLocationHandler = async (request: IRequest, response: Response) => {
	const { roles } = request.user;
	const location = await addLocationService(request.body.data, roles);
	const data = getResponseData(location);
	response.status(Constants.status.CREATED).json(data);
};
