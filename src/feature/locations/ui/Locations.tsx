import { PAGES } from 'base/config/pages';
import { LoadPageError } from 'base/ui/components/layouts/LoadPageError';
import { PageLayout } from 'base/ui/components/layouts/PageLayout';
import { Countries } from 'feature/locations/ui/components/Countries';
import { LocationContext } from 'feature/locations/ui/contexts/browser/locationContext';
import { useLocations } from 'feature/locations/ui/hooks/useLocations';
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
