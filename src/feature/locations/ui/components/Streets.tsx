import { LOCATION } from 'feature/locations/config/location';
import { IStateLocation, IStreetLocation } from 'feature/locations/requests/locationTypes';
import { Place } from 'feature/locations/ui/components/Place';
import PropTypes from 'prop-types';
import React from 'react';

interface IStreetsProps {
	streets: IStreetLocation[];
}

export const Streets: React.FC<IStreetsProps> = ({ streets }) => {
	const renderStreet = (street: IStateLocation) => {
		const { name, id } = street;
		return <Place level={LOCATION.levels.STREET} id={id} name={name} />;
	};

	return <ul>{React.Children.toArray(streets.map(renderStreet))}</ul>;
};

Streets.propTypes = {
	streets: PropTypes.array.isRequired
};
