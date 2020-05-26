import { IApiRoute } from '../../types';
import { getApiRouter } from '../serverService';

beforeEach(() => jest.clearAllMocks());

describe('#serverService', () => {
	describe('#getApiRouter', () => {
		const router: any = {
			post: jest.fn()
		};

		const routes: IApiRoute[] = [
			{
				path: '/users/auth',
				method: 'post',
				controller: (): any => {}
			}
		];

		test('should create an api router', () => {
			const api = getApiRouter(router, routes);
			expect(api).toBeDefined();
		});

		test('should call request method on router corresponding with routes method', () => {
			getApiRouter(router, routes);
			expect(router.post).toHaveBeenCalledTimes(1);
		});
	});
});
