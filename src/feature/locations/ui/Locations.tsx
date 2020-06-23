import { getLocationsApiAction } from 'feature/locations/services/browser/getLocationsApiAction';
import { IApiLocation } from 'feature/locations/services/browser/locationTypes';
import React from 'react';

export const Locations: React.FC = () => {
	const [locations, setLocations] = React.useState<IApiLocation[]>([]);
	const [loading, setLoading] = React.useState(true);

	const [error, setError] = React.useState('');

	const isMounted = React.useRef(true);

	React.useEffect(() => {
		const fetchLocations = async () => {
			const response = await getLocationsApiAction();
			if (!isMounted.current) return;
			if (response.error) return setError(response.error);
			setLocations(response.data!);
			setLoading(false);
		};

		fetchLocations();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const renderLocation = (location: IApiLocation) => {
		const { states } = location;
		const statesList = states.map((state) => {
			const { cities } = state;
			const citiesList = cities.map((city) => {
				const { streets } = city;
				const streetsList = streets.map((street) => {
					return <li key={street.id}>{street.name}</li>;
				});
				return (
					<li key={city.id}>
						{city.name}
						<ul>{React.Children.toArray(streetsList)}</ul>
					</li>
				);
			});
			return (
				<li key={state.id}>
					{state.name}
					<ul>{React.Children.toArray(citiesList)}</ul>
				</li>
			);
		});
		return (
			<li key={location.id}>
				{location.name}
				<ul>{React.Children.toArray(statesList)}</ul>
			</li>
		);
	};

	return (
		<main>
			{loading ? (
				<div>Loading</div>
			) : (
				<div>
					<h1>Locations</h1>
					{error && <p>{error}</p>}
					<ul>{React.Children.toArray(locations.map(renderLocation))}</ul>
				</div>
			)}
		</main>
	);
};
