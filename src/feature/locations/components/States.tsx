import { Cities } from 'feature/locations/components/Cities';
import { Place } from 'feature/locations/components/Place';
import { LocationConstants } from 'feature/locations/config/constants';
import { IStateLocation } from 'feature/locations/requests/locationTypes';
import PropTypes from 'prop-types';
import React from 'react';

interface IStatesProps {
	states: IStateLocation[];
}

export const States: React.FC<IStatesProps> = ({ states }) => {
	const renderState = (state: IStateLocation) => {
		const { name, cities, id } = state;

		return (
			<Place level={LocationConstants.levels.STATE} id={id} name={name}>
				<Cities cities={cities} />
			</Place>
		);
	};

	return <ul>{React.Children.toArray(states.map(renderState))}</ul>;
};

States.propTypes = {
	states: PropTypes.array.isRequired
};
