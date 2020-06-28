import { Place } from 'feature/locations/components/Place';
import { States } from 'feature/locations/components/States';
import { LocationConstants } from 'feature/locations/config/constants';
import { IApiLocation } from 'feature/locations/requests/locationTypes';
import PropTypes from 'prop-types';
import React from 'react';

interface ICountriesProps {
	locations: IApiLocation[];
}

export const Countries: React.FC<ICountriesProps> = ({ locations }) => {
	const renderLocation = (location: IApiLocation) => {
		const { states, name, id } = location;

		return (
			<Place level={LocationConstants.levels.COUNTRY} id={id} name={name} key={id}>
				<States states={states} />
			</Place>
		);
	};

	return <ul>{React.Children.toArray(locations.map(renderLocation))}</ul>;
};

Countries.propTypes = {
	locations: PropTypes.array.isRequired
};
