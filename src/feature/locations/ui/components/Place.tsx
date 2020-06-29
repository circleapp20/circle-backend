import {
	LocationContext,
	LocationLevel
} from 'feature/locations/ui/contexts/browser/locationContext';
import PropTypes from 'prop-types';
import React from 'react';

interface IPlaceProps {
	name: string;
	id: string;
	level: LocationLevel;
}

export const Place: React.FC<IPlaceProps> = ({
	name,
	id,
	level,
	// eslint-disable-next-line react/prop-types
	children
}) => {
	const { onViewLocation } = React.useContext(LocationContext);

	const onClick = () => onViewLocation(id, level);

	return (
		<li>
			<span style={styles.item} onClick={onClick}>
				{name}
			</span>
			{children}
		</li>
	);
};

Place.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	level: PropTypes.oneOf<LocationLevel>(['city', 'country', 'state', 'street']).isRequired
};

const styles = {
	item: {
		cursor: 'pointer'
	}
};
