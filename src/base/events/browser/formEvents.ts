import React from 'react';

export const updateStateWithFieldChangeValue = (
	functionUpdateState: React.Dispatch<React.SetStateAction<string | number>>
) => {
	return (event: React.ChangeEvent<HTMLInputElement>) => {
		functionUpdateState(event.target.value);
	};
};
