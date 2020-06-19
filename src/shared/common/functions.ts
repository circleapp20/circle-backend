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
