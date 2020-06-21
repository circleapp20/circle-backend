/**
 * Interface for updating a user
 * @interface IUpdateUserProfile
 */
export interface IUpdateUserProfile {
	/**
	 * user's generated id
	 * @readonly
	 * @public
	 */
	id: string;

	/**
	 * user's username
	 * @public
	 */
	username: string;

	/**
	 * user's password
	 * @public
	 */
	password: string;

	/**
	 * user's date of birth
	 * @public
	 */
	dob: Date;

	/**
	 * profile image of the user
	 * @public
	 */
	image: string;

	/**
	 * biography or status of the user
	 * @public
	 */
	biography: string;

	/**
	 * full name of user
	 * @public
	 */
	name: string;

	/**
	 * user's email
	 * @public
	 */
	email: string;

	/**
	 * user's phone number
	 * @public
	 */
	phoneNumber: string;
}

/**
 * Interface for adding locations to a user
 * @interface IAddUserLocation
 */
export interface IAddUserLocation {
	/**
	 * user's id stored in users table
	 * @readonly
	 * @public
	 */
	id: string;

	/**
	 * list of locations id in the locations table
	 * @public
	 */
	locationsId: string[];
}
