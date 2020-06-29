import { LOCATION } from 'feature/locations/config/location';
import { IApiLocation } from 'feature/locations/requests/locationTypes';
import { Place } from 'feature/locations/ui/components/Place';
import { States } from 'feature/locations/ui/components/States';
import PropTypes from 'prop-types';
import React from 'react';

interface ICountriesProps {
	locations: IApiLocation[];
}

export const Countries: React.FC<ICountriesProps> = ({ locations }) => {
	const renderLocation = (location: IApiLocation) => {
		const { states, name, id } = location;

		return (
			<Place level={LOCATION.levels.COUNTRY} id={id} name={name} key={id}>
				<States states={states} />
			</Place>
		);
	};

	return <ul>{React.Children.toArray(locations.map(renderLocation))}</ul>;
};

Countries.propTypes = {
	locations: PropTypes.array.isRequired
};
