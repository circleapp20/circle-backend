# Circle - Stores

Stores on circle are based of the same concept of stores in real life. In that, people create or own stores, where other people can purchase items or products from side store.

Basing on this concept, stores on circle can be created by users on circle, either a normal user or a fellow.

Users can create multiple stores which can server different purposes such as, a store for selling foodstuffs, restaurants, technology and many others. These can be specified by the user at the category section as any of the defined circle categories for stores namely: Restaurant, Technology, Trading, Other. Where other, the user can specify the kind of category the store deals in.

A store can also not necessarily be in the same location as the user. Since, the user can be an owner of a store situated in a different state, other than the one the user is in.

Other requirements for the store are: name of the store.

With these base parameters, the structure of a store is shown below using typescript classes

```typescript
class Store {
	name: string;

	category: string;

	// location of the store
	location: Locations;

	// owner of the store (admin)
	user: Users;
}
```

On circle, users are allowed to follow a store or multiple stores. This captures the scenario that, the users are taking notice of any news about the store. Whether, new products have been added, an update to their terms and conditions and many more.

The store that is create by a user on circle needs to be verified by the lead fellows on circle. This is to ensure that the store is not a fake one that will be used to scam other users of circle.

Adding this criteria to the already existing structure for the store. Which is shown below

```typescript
class Store {
	name: string;

	category: string;

	// is authentic or authorized by circle admins
	isVerified: boolean;

	// location of the store
	location: Locations;

	// owner of the store (admin)
	user: Users;

	// users following the store
	followers: Users[];
}
```
