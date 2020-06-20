import { flattenArray, reduceArgsToArray } from 'base/common/functions';
import { IApiRoute } from 'base/types';
import { authRoutes } from 'feature/authentication/api/routes';
import { locationApiRoutes } from 'feature/locations/api/routes';
import { usersRoutes } from 'feature/users/api/routes';

export const apiRoutes = flattenArray<IApiRoute>(
	reduceArgsToArray(authRoutes, usersRoutes, locationApiRoutes)
);
