import React from 'react';

interface ILocationContextTypes {
	onViewLocation: (id: string, level: LocationLevel) => void;
}

export type LocationLevel = 'state' | 'city' | 'street' | 'country';

export const LocationContext = React.createContext<ILocationContextTypes>({
	onViewLocation: (_: string, __: LocationLevel) => {
		return;
	}
});
