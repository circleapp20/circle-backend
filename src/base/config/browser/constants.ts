import { Constants as SharedConstants } from 'base/config/common/constants';

const Pages = {
	ADD_LOCATION: '/locations/add-location',
	LOCATIONS: '/locations',

	AUTH_SIGN_IN: '/auth/sign-in'
};

export const Constants = {
	...SharedConstants,
	services:
		process.env.NODE_ENV === 'production'
			? {
					MAIN: 'https://circle20.herokuapp.com/api/v1'
			  }
			: {
					MAIN: 'http://localhost:4000/api/v1'
			  },
	keys: {
		STORED_AUTH_USER_KEY: 'foo4iun71qq8'
	},
	pages: { ...Pages }
};
