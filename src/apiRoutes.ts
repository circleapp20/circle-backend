import { authRoutes } from 'feature/authentication/node/routes';
import { usersRoutes } from 'feature/users/node/routes';

export const apiRoutes = [...authRoutes, ...usersRoutes];
