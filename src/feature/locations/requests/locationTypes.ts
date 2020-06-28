export interface ILocationDetails {
	address: string;
	createdAt: string;
	updatedAt: string;
	id: string;
	isVerified: boolean;
	latitude: number;
	name: string;
	longitude: number;
}

export type IStreetLocation = ILocationDetails;

export interface ICityLocation extends ILocationDetails {
	streets: IStreetLocation[];
}

export interface IStateLocation extends ILocationDetails {
	cities: ICityLocation[];
}

export interface IApiLocation extends ILocationDetails {
	states: IStateLocation[];
}
