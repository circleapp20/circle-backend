export const generateRandomCode = () => {
	return Math.floor(Math.random() * 10e5).toString(32);
};
