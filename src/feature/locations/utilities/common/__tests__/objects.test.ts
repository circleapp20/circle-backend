import { locationsList } from 'fixtures/locations';
import { changeLocationPlacesName } from '../objects';

describe('#changeLocationPlacesName', () => {
	test('should rename places', () => {
		const updatedLocations = locationsList.map((location) => {
			const locations = changeLocationPlacesName(location);
			return locations;
		});
		expect(updatedLocations).toMatchSnapshot('updated location places names');
	});
});
