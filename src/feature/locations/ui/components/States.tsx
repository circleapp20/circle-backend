import { LOCATION } from 'feature/locations/config/location';
import { IStateLocation } from 'feature/locations/requests/locationTypes';
import { Cities } from 'feature/locations/ui/components/Cities';
import { Place } from 'feature/locations/ui/components/Place';
import PropTypes from 'prop-types';
import React from 'react';

interface IStatesProps {
	states: IStateLocation[];
}

export const States: React.FC<IStatesProps> = ({ states }) => {
	const renderState = (state: IStateLocation) => {
		const { name, cities, id } = state;

		return (
			<Place level={LOCATION.levels.STATE} id={id} name={name}>
				<Cities cities={cities} />
			</Place>
		);
	};

	return <ul>{React.Children.toArray(states.map(renderState))}</ul>;
};

States.propTypes = {
	states: PropTypes.array.isRequired
};
