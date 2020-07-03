import { SERVER } from 'base/config/server';
import * as encryption from 'core/encryption/node/encryption';

describe('#generateHashedValue', () => {
	test('should return a hashed value of the input', () => {
		const results = encryption.generateHashedValue('testing hashing');
		expect(results).not.toBe('testing hashing');
	});

	test('should return a string value', () => {
		const results = encryption.generateHashedValue('testing hashing');
		expect(results).toEqual(expect.any(String));
	});

	test('should not return an empty string', () => {
		const results = encryption.generateHashedValue('testing hashing');
		expect(results).not.toBe('');
	});

	test('should generate the same hash for the same inputs', () => {
		const firstValue = encryption.generateHashedValue('testing hashing');
		const secondValue = encryption.generateHashedValue('testing hashing');
		expect(firstValue).toBe(secondValue);
	});

	test('should generate different hash for different inputs', () => {
		const firstValue = encryption.generateHashedValue('testing hashing');
		const secondValue = encryption.generateHashedValue('testing');
		expect(firstValue).not.toBe(secondValue);
	});
});

describe('#getHashedSecretKey', () => {
	test('should return a hashed string of the secret key', () => {
		const results = encryption.getHashedSecretKey();
		expect(results).not.toBe(SERVER.app.SECRET);
	});

	test('should not return an empty string', () => {
		const results = encryption.getHashedSecretKey();
		expect(results).not.toBe('');
	});
});

describe('#getCryptoIvBuffer', () => {
	test('should return a buffer', () => {
		const value = encryption.getCryptoIvBuffer();
		expect(value).toEqual(expect.any(Buffer));
	});
});

describe('#getCryptoCipherAndDecipher', () => {
	let encryptor: any;

	beforeEach(() => {
		encryptor = {
			createCipheriv: jest.fn(),
			createDecipheriv: jest.fn()
		};
	});

	test('should create a cipher using algorithm, secret key and iv', () => {
		encryption.getCryptoCipherAndDecipher({ algorithm: 'aes-256-gcm', encryptor });
		expect(encryptor.createCipheriv).toHaveBeenCalledWith(
			expect.stringMatching('aes-256-gcm'),
			expect.any(Buffer),
			expect.any(Buffer)
		);
	});

	test('should create a decipher using algorithm, secret key and iv', () => {
		encryption.getCryptoCipherAndDecipher({ algorithm: 'aes-256-gcm', encryptor });
		expect(encryptor.createDecipheriv).toHaveBeenCalledWith(
			expect.stringMatching('aes-256-gcm'),
			expect.any(Buffer),
			expect.any(Buffer)
		);
	});

	test('should return object with cipher property', () => {
		const result = encryption.getCryptoCipherAndDecipher({
			algorithm: 'aes-256-gcm',
			encryptor
		});
		expect(result).toHaveProperty('cipher');
	});

	test('should return object with decipher property', () => {
		const result = encryption.getCryptoCipherAndDecipher({
			algorithm: 'aes-256-gcm',
			encryptor
		});
		expect(result).toHaveProperty('decipher');
	});

	test('should use the iv as buffer', () => {
		const spy = jest.spyOn(Buffer, 'from');
		encryption.getCryptoCipherAndDecipher({ algorithm: 'aes-256-gcm', encryptor, iv: '839f' });
		expect(spy).toHaveBeenLastCalledWith('839f', 'hex');
	});
});

describe('#encryptData', () => {
	let finalMock: any, updateMock: any, encryptor: any, authTagMock: any;

	beforeEach(() => {
		finalMock = jest.fn(() => Buffer.from('die7ug'));
		updateMock = jest.fn(() => Buffer.from('asd456fgh6789hjk1l890'));
		authTagMock = jest.fn(() => Buffer.from('t5auth'));
		encryptor = {
			createCipheriv: jest.fn(() => ({
				final: finalMock,
				getAuthTag: authTagMock,
				update: updateMock
			})),
			createDecipheriv: jest.fn()
		};
	});

	test('should encrypt text with cipher', () => {
		encryption.encryptData({
			text: 'testing',
			encryptor
		});
		expect(updateMock).toHaveBeenCalledWith('testing', 'utf8', 'hex');
	});

	test('should return a string', () => {
		const value = encryption.encryptData({
			text: 'testing',
			encryptor
		});
		expect(value).toEqual(expect.any(String));
	});

	test('should allow other encryption algorithms', () => {
		encryption.encryptData({
			text: 'testing',
			encryptor,
			algorithm: 'aes'
		});
		expect(encryptor.createCipheriv).toHaveBeenCalledWith(
			expect.stringMatching('aes'),
			expect.any(Buffer),
			expect.any(Buffer)
		);
	});

	test('should return encrypted text', () => {
		const value = encryption.encryptData({
			text: 'testing',
			encryptor
		});
		expect(value).not.toBe('testing');
	});

	test('should encrypt text using default encryptor', () => {
		const value = encryption.encryptData({
			text: 'testing'
		});
		expect(value).not.toBe('');
	});
});

describe('#decryptData', () => {
	let finalMock: any, updateMock: any, encryptor: any, setAuthMock: any;

	beforeEach(() => {
		finalMock = jest.fn().mockReturnValue(Buffer.from('die7ug'));
		updateMock = jest.fn().mockReturnValue(Buffer.from('asd456fgh6789hjk1l890'));
		setAuthMock = jest.fn();
		encryptor = {
			createCipheriv: jest.fn(),
			createDecipheriv: jest.fn(() => ({
				final: finalMock,
				setAuthTag: setAuthMock,
				update: updateMock
			}))
		};
	});

	test('should create a decipher using an algorithm', () => {
		encryption.decryptData({
			encryptedText: 'shf4kj8f%%oe6nfw5eif2%%498nf98',
			encryptor,
			algorithm: 'aes'
		});
		expect(encryptor.createDecipheriv).toHaveBeenCalledWith(
			expect.stringMatching('aes'),
			expect.any(Buffer),
			expect.any(Buffer)
		);
	});

	test('should decrypt the buffered encrypted text', () => {
		encryption.decryptData({
			encryptedText: 'shf4kj8f%%oe6nfw5eif2%%498nf98',
			encryptor
		});
		expect(updateMock).not.toHaveBeenCalledWith('shf4kj8f%%oe6nfw5eif2%%498nf98');
		expect(updateMock).toHaveBeenCalledWith('shf4kj8f', 'hex', 'utf8');
	});

	test('should return decrypted string', () => {
		const value = encryption.decryptData({
			encryptedText: 'shf4kj8f%%oe6nfw5eif2%%498nf98',
			encryptor
		});
		expect(value).not.toBe('shf4kj8f%%oe6nfw5eif2%%498nf98');
	});

	test('should decrypt using default crypto', () => {
		const value = encryption.encryptData({
			text: 'testing'
		});
		const result = encryption.decryptData({
			encryptedText: value
		});
		expect(result).toBe('testing');
	});
});
