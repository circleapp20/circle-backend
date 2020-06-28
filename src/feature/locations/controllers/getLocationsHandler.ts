import { Constants } from 'base/config/node/constants';
import { IRequest } from 'base/types';
import { getResponseData } from 'base/utils/node/formatDataFunctions';
import { Response } from 'express';
import {
	getCircleLocations,
	getLocationDetails
} from 'feature/locations/services/node/getLocationsService';

export const getLocationsHandler = async (_: IRequest, res: Response) => {
	const locations = await getCircleLocations();
	const data = getResponseData(locations);
	res.status(Constants.status.SUCCESS).json(data);
};

export const getLocationDetailsHandler = async (req: IRequest, res: Response) => {
	const location = await getLocationDetails(req.params.id);
	const data = getResponseData(location);
	res.status(Constants.status.SUCCESS).json(data);
};
