import { LOCATION } from 'feature/locations/config/location';
import { ICityLocation } from 'feature/locations/requests/locationTypes';
import { Place } from 'feature/locations/ui/components/Place';
import { Streets } from 'feature/locations/ui/components/Streets';
import PropTypes from 'prop-types';
import React from 'react';

interface ICitiesProps {
	cities: ICityLocation[];
}

export const Cities: React.FC<ICitiesProps> = ({ cities }) => {
	const renderCity = (city: ICityLocation) => {
		const { name, streets, id } = city;

		return (
			<Place name={name} id={id} level={LOCATION.levels.CITY}>
				<Streets streets={streets} />
			</Place>
		);
	};

	return <ul>{React.Children.toArray(cities.map(renderCity))}</ul>;
};

Cities.propTypes = {
	cities: PropTypes.array.isRequired
};
