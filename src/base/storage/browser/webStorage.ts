export const getDataInWebStorage = (key: string) => {
	const encodedStoredData = window.localStorage.getItem(key);
	return encodedStoredData ? JSON.parse(encodedStoredData) : null;
};

export const storeDataInWebStorage = <Data = any>(key: string, value: Data) => {
	const encodedDataToStore = typeof value === 'string' ? value : JSON.stringify(value);
	window.localStorage.setItem(key, encodedDataToStore);
};
