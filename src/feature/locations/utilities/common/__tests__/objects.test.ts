import { changeLocationPlacesName } from 'feature/locations/utilities/common/objects';
import { locationsList } from 'fixtures/locations';

describe('#changeLocationPlacesName', () => {
	test('should rename places', () => {
		const updatedLocations = locationsList.map((location) => {
			const locations = changeLocationPlacesName(location);
			return locations;
		});
		expect(updatedLocations).toMatchSnapshot('updated location places names');
	});
});
