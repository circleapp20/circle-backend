export const printToConsole = (args: any, level = 'INFO') => {
	const timestamp = new Date().toUTCString();
	let textToPrint = args;
	if (typeof args === 'object' && !Array.isArray(args)) {
		textToPrint = JSON.stringify(args, null, 2);
	}
	console.log(`\x1b[32m[${timestamp}] [${level}] [circle] -\x1b[0m ${textToPrint}`);
};
