export const memoize = <ReturnType = any>(functionToMemoize: (...args: any[]) => ReturnType) => {
	const memoizedCache: Record<string, any> = {};
	return (...args: any[]): ReturnType => {
		const functionNameWithArgs = [''].concat(functionToMemoize.name, ...args).join('');
		if (!memoizedCache[functionNameWithArgs]) {
			memoizedCache[functionNameWithArgs] = functionToMemoize(...args);
		}
		return memoizedCache[functionNameWithArgs];
	};
};

export const reduceArgsToArray = <T>(...args: T[]) => {
	const emptyArray: T[] = [];
	return emptyArray.concat(...args);
};

export const flattenArray = <T>(arr: any): T[] => {
	return arr.reduce((acc: [], value: any) => {
		return Array.isArray(value) ? [...acc, ...value] : [...acc, value];
	}, []);
};
