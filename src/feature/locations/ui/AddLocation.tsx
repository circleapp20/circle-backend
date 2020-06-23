import { Constants } from 'base/config/browser/constants';
import { updateStateWithFieldChangeValue } from 'base/events/browser/formEvents';
import { getDataInWebStorage } from 'base/storage/browser/webStorage';
import { addLocationApiAction } from 'feature/locations/services/browser/addLocationApiAction';
import Router from 'next/router';
import React from 'react';

export const AddLocation: React.FC = () => {
	const [name, setName] = React.useState('');
	const [address, setAddress] = React.useState('');
	const [latitude, setLatitude] = React.useState('');
	const [longitude, setLongitude] = React.useState('');

	const [loading, setLoading] = React.useState(true);
	const [authUser, setAuthUser] = React.useState(null);
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		const user = getDataInWebStorage(Constants.keys.STORED_AUTH_USER_KEY);
		setAuthUser(user);
		setLoading(false);
	}, []);

	const onAddLocation = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const locationData = { name, address, latitude, longitude, placeId: '' };
		const response = await addLocationApiAction(locationData);
		if (response.error) {
			return setError(response.error);
		}
		Router.push(Constants.pages.LOCATIONS);
	};

	if (!loading && !authUser) {
		Router.replace(Constants.pages.AUTH_SIGN_IN);
	}

	return (
		<main>
			{loading ? (
				<h1>Loading page</h1>
			) : (
				<div>
					<h1>Add Location</h1>
					<form onSubmit={onAddLocation}>
						<input
							placeholder="Name of location"
							minLength={2}
							onChange={updateStateWithFieldChangeValue(setName)}
							required
							type="text"
						/>
						<input
							type="text"
							placeholder="Address"
							onChange={updateStateWithFieldChangeValue(setAddress)}
						/>
						<input
							type="number"
							placeholder="Latitude"
							required
							step="any"
							onChange={updateStateWithFieldChangeValue(setLatitude)}
						/>
						<input
							type="number"
							placeholder="Longitude"
							required
							step="any"
							onChange={updateStateWithFieldChangeValue(setLongitude)}
						/>
						<button type="submit">Add Location</button>
					</form>
					{error && <h2>{error}</h2>}
				</div>
			)}
		</main>
	);
};
