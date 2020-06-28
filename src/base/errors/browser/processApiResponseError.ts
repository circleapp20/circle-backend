export const processApiResponseError = (error: Error) => {
	console.log(JSON.stringify(error, null, 2));
	return { error: error.message };
};
