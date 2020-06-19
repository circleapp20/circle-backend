import { memoize } from 'shared/common/functions';

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
