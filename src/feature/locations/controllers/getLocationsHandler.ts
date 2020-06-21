import { getResponseData } from 'base/common/utilities';
import { Constants } from 'base/constants';
import { IRequest } from 'base/types';
import { Response } from 'express';
import { getCircleLocations } from '../services/node/getLocationsService';

export const getLocationsHandler = async (_: IRequest, res: Response) => {
	const locations = await getCircleLocations();
	const data = getResponseData(locations);
	res.status(Constants.status.SUCCESS).json(data);
};
