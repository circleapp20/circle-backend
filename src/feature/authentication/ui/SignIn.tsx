import { PageLayout } from 'base/components/browser/layouts/PageLayout';
import { PAGES } from 'base/config/browser/pages';
import { useAuthUser } from 'base/hooks/useAuthUser';
import { verifyUserCredentials } from 'feature/authentication/services/browser/authUserCredentials';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

export const SignIn: React.FC = () => {
	const { replace } = useRouter();
	const [error, setError] = React.useState('');
	const { user, setUser } = useAuthUser();
	const formik = useFormik({
		initialValues: { email: '', password: '' },
		onSubmit: async (values) => {
			const response = await verifyUserCredentials(values);

			if (response.error) {
				return setError(response.error);
			}

			setUser(response.data);
		}
	});

	if (user) {
		replace(PAGES.LOCATIONS);
	}

	return (
		<PageLayout>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<input
						type="email"
						required
						minLength={6}
						onChange={formik.handleChange}
						name="email"
						placeholder="Email"
						id="email"
						value={formik.values.email}
					/>
					<input
						type="password"
						id="password"
						required
						minLength={6}
						name="password"
						placeholder="Password"
						onChange={formik.handleChange}
						value={formik.values.password}
					/>
					<button type="submit">Sign In</button>
				</form>
			</div>
			{error && <p>{error}</p>}
		</PageLayout>
	);
};
