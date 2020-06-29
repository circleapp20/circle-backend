import { PAGES } from 'base/config/pages';
import { LoadPageError } from 'base/ui/components/layouts/LoadPageError';
import { PageLayout } from 'base/ui/components/layouts/PageLayout';
import { LOCATION } from 'feature/locations/config/location';
import { useLocationDetails } from 'feature/locations/ui/hooks/useLocationDetails';
import { useRouter } from 'next/router';
import React from 'react';

export const LocationDetails: React.FC = () => {
	const { query, push } = useRouter();
	const { data: location, error, loading } = useLocationDetails(query.id as string);

	const onAddLocation = () => {
		const pageURL = `${PAGES.ADD_LOCATION}?placeId=${query.id}`;
		push(pageURL);
	};

	return (
		<PageLayout authenticated loading={loading}>
			<LoadPageError error={error}>
				{!location ? (
					<div>No location found</div>
				) : (
					<div>
						<h1>{location.name}</h1>
						<ul>
							<li>
								<strong>Location Name:</strong> {location.name}
							</li>
							<li>
								<strong>Level:</strong> {query.level}
							</li>
							<li>
								<strong>Address:</strong> {location.address}
							</li>
							<li>
								<strong>Latitude:</strong> {location.latitude}
							</li>
							<li>
								<strong>Longitude:</strong> {location.longitude}
							</li>
						</ul>
						{query.level !== LOCATION.levels.STREET && (
							<button onClick={onAddLocation}>Add location</button>
						)}
					</div>
				)}
			</LoadPageError>
		</PageLayout>
	);
};
