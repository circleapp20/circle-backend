import jwt from 'jsonwebtoken';
import { Constants } from '../constants';

export const getSignedAuthToken = (data: string | object) => {
	return jwt.sign(data, Constants.app.SECRET);
};
