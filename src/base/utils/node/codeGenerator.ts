export const generateRandomValue = () => {
	return Math.random();
};

// generateCodeFromNumber function generates a text from the value
// if the value is not provided, a random value is generate using
// generateRandomValue function and returns it's code
export const generateCodeFromNumber = (value?: number) => {
	const codeNumber = value ? value : generateRandomValue();
	return codeNumber.toString(32).replace('.', '').slice(0, 6);
};
