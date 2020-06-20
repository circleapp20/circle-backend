# Circle - Locations

Locations in circle all have the same format of name, address, latitude, longitude, isVerified. In view of this, locations must relate to each other, such as country having states, states with cities and cities having streets. To create the relation in the database, a reference column is added called places. This makes it possible to relate locations with other locations based of their id.

In querying the locations to get its, other related locations. Use the SELF join query, to get the related locations or sub locations. Since typeorm is used as our ORM, the query builder format is shown below.

```typescript
export const locationQueryBuilderFormat = (manager: EntityManager) => {
	return manager
		.createQueryBuilder(Locations, 'location')
		.leftJoinAndSelect('location.places', 'states') // get related locations as states
		.leftJoinAndSelect('states.places', 'cities') // get related location as cities for states
		.leftJoinAndSelect('cities.places', 'streets'); // get locations as streets for cities
};
```

To add a new location either by suggestion or by the lead fellow. The details of the location should be added to the database before its related to another location if any.

First of all, locations must be added to the users update endpoint

LOCATIONS
a GET endpoints to return all locations on circle in a JSON format like you already do.
this should include name, nickname and if possible, Google maps coordinates

The return will include:
Main locations (I.e , KNUST and UG for now) with the number of sub locations under them.
The sub locations under each main location and if the sub location has other sub locations, then the number of sub locations should be added and the locations under it.

an endpoint for saving suggested locations by a user. (Name, nickname and description)
