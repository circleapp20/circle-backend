import { Constants } from 'base/config/browser/constants';
import { getDataInWebStorage, storeDataInWebStorage } from 'base/storage/browser/webStorage';
import React from 'react';

export const useAuthUser = () => {
	const [authUser, setAuthUser] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	const isMounted = React.useRef(true);

	React.useEffect(() => {
		const user = getDataInWebStorage(Constants.keys.STORED_AUTH_USER_KEY);

		if (isMounted.current) {
			setAuthUser(user);
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const saveAuthenticatedUser = (data: any) => {
		storeDataInWebStorage(Constants.keys.STORED_AUTH_USER_KEY, data);
		setAuthUser(data);
	};

	return { user: authUser, loading, setUser: saveAuthenticatedUser };
};
