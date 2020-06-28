import { LoadPageError } from 'base/components/browser/layouts/LoadPageError';
import { PageLayout } from 'base/components/browser/layouts/PageLayout';
import { PAGES } from 'base/config/browser/pages';
import { Countries } from 'feature/locations/components/Countries';
import { LocationContext } from 'feature/locations/contexts/browser/locationContext';
import { useLocations } from 'feature/locations/hooks/useLocations';
import { useRouter } from 'next/router';
import React from 'react';

export const Locations: React.FC = () => {
	const { push } = useRouter();
	const { loading, error, data: locations } = useLocations();

	const onViewLocation = (id: string, level: string) => {
		push(`${PAGES.LOCATION_PROFILE}/${id}?level=${level}`);
	};

	return (
		<PageLayout authenticated loading={loading}>
			<LoadPageError error={error}>
				<LocationContext.Provider value={{ onViewLocation }}>
					<div>
						<h1>Locations</h1>
						<Countries locations={locations || []} />
					</div>
				</LocationContext.Provider>
			</LoadPageError>
		</PageLayout>
	);
};
