import { LocationLevel } from 'feature/locations/ui/contexts/browser/locationContext';

interface ILocationLevel {
	COUNTRY: LocationLevel;
	STATE: LocationLevel;
	CITY: LocationLevel;
	STREET: LocationLevel;
}

export const LOCATION = {
	api: {
		LOCATIONS: '/locations'
	},
	errors: {
		LOCATION_NOT_FOUND: 'LOCATION_NOT_FOUND'
	},
	levels: {
		COUNTRY: 'country',
		STATE: 'state',
		CITY: 'city',
		STREET: 'street'
	} as ILocationLevel
};
