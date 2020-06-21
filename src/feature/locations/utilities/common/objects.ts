export const changeLocationPlacesName = (location: any, index = 0) => {
	const { places, ...rest } = location;
	let locationPlaces = places;
	if (locationPlaces.length) {
		// mutation happens here
		locationPlaces = places.map((place: any) => changeLocationPlacesName(place, index + 1));
	}
	const names = ['states', 'cities', 'streets'];
	if (names[index]) rest[names[index]] = locationPlaces;
	return rest;
};
