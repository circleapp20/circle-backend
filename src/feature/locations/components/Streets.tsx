import { Place } from 'feature/locations/components/Place';
import { LocationConstants } from 'feature/locations/config/constants';
import { IStateLocation, IStreetLocation } from 'feature/locations/requests/locationTypes';
import PropTypes from 'prop-types';
import React from 'react';

interface IStreetsProps {
	streets: IStreetLocation[];
}

export const Streets: React.FC<IStreetsProps> = ({ streets }) => {
	const renderStreet = (street: IStateLocation) => {
		const { name, id } = street;
		return <Place level={LocationConstants.levels.STREET} id={id} name={name} />;
	};

	return <ul>{React.Children.toArray(streets.map(renderStreet))}</ul>;
};

Streets.propTypes = {
	streets: PropTypes.array.isRequired
};
