export const changeLocationPlacesName = (location: any, index = 0) => {
	const { places, ...rest } = location;

	let locationPlaces = places;

	// mutation happens here
	if (places && places.length) {
		locationPlaces = places.map((place: any) => changeLocationPlacesName(place, index + 1));
	}

	const names = ['states', 'cities', 'streets'];
	const locationName = names[index];

	if (locationName) rest[locationName] = locationPlaces;

	return rest;
};
