import { Constants } from 'base/config/browser/constants';
import { updateStateWithFieldChangeValue } from 'base/events/browser/formEvents';
import { storeDataInWebStorage } from 'base/storage/browser/webStorage';
import { verifyUserCredentials } from 'feature/authentication/services/browser/authUserCredentials';
import Router from 'next/router';
import React from 'react';

export const SignIn: React.FC = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [error, setError] = React.useState('');

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await verifyUserCredentials({ email, password });
		if (response.error) {
			return setError(response.error);
		}
		storeDataInWebStorage(Constants.keys.STORED_AUTH_USER_KEY, response.data);
		Router.push(Constants.pages.ADD_LOCATION);
	};

	return (
		<main>
			<div>
				<form onSubmit={onSubmit}>
					<input
						type="email"
						required
						minLength={6}
						onChange={updateStateWithFieldChangeValue(setEmail)}
						name="email"
						placeholder="Email"
					/>
					<input
						type="password"
						required
						minLength={6}
						name="password"
						placeholder="Password"
						onChange={updateStateWithFieldChangeValue(setPassword)}
					/>
					<button type="submit">Sign In</button>
				</form>
			</div>
			{error && <p>{error}</p>}
		</main>
	);
};
