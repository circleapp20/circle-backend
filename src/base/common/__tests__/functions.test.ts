import { flattenArray, memoize, reduceArgsToArray } from 'base/common/functions';

describe('#memoize', () => {
	const add = (firstNumber: number, secondNumber: number) => firstNumber + secondNumber;

	test('should call function only once', () => {
		const mockFn = jest.fn(() => 4);
		const memoizedFn = memoize(mockFn);
		memoizedFn();
		memoizedFn();
		memoizedFn();
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test('should return the same value for the same inputs', () => {
		const memoizedAdd = memoize(add);
		const firstValue = memoizedAdd(1, 5);
		const secondValue = memoizedAdd(1, 5);
		expect(firstValue).toBe(secondValue);
	});

	test('should return different values for different inputs', () => {
		const memoizedAdd = memoize(add);
		const firstValue = memoizedAdd(5, 5);
		const secondValue = memoizedAdd(1, 5);
		expect(firstValue).not.toBe(secondValue);
	});

	test('should pass arguments to the function', () => {
		const mockFn = jest.fn(() => 4);
		const memoizedFn = memoize(mockFn);
		memoizedFn(7);
		expect(mockFn).toHaveBeenCalledWith(7);
	});
});

describe('#reduceArgsToArray', () => {
	test('should return a single array', () => {
		const arr = reduceArgsToArray();
		expect(arr).toEqual([]);
	});

	test('should place args in the returned array', () => {
		const arr = reduceArgsToArray('Peter', 'Johnson');
		expect(arr).toEqual(['Peter', 'Johnson']);
	});

	test('should return array with same order as args', () => {
		const arr = reduceArgsToArray('Peter', 'Johnson');
		expect(arr).not.toEqual(['Johnson', 'Peter']);
	});
});

describe('#flattenArrayWithDepth', () => {
	test('should flatten a multi-dimensional array to single array', () => {
		const value = flattenArray<string>([['Peter', 'Johnson']]);
		expect(value).toEqual(['Peter', 'Johnson']);
	});

	test('should only flatten items of type array', () => {
		const value = flattenArray<string>([['Peter'], 'Johnson']);
		expect(value).toEqual(['Peter', 'Johnson']);
	});
});
