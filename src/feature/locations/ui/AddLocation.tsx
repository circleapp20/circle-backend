import { PageLayout } from 'base/ui/components/layouts/PageLayout';
import { addLocationApiAction } from 'feature/locations/services/browser/addLocationApiAction';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

export const AddLocation: React.FC = () => {
	const { query } = useRouter();

	const [error, setError] = React.useState('');

	const formik = useFormik({
		initialValues: {
			name: '',
			address: '',
			latitude: 0,
			longitude: 0,
			placeId: query.placeId || ''
		},
		onSubmit: async (values, actions) => {
			const response = await addLocationApiAction(values);

			if (response.error) {
				return setError(response.error);
			}

			actions.resetForm();
		}
	});

	return (
		<PageLayout authenticated>
			<div>
				<h1>Add Location</h1>
				<form onSubmit={formik.handleSubmit}>
					<input
						placeholder="Name of location"
						minLength={2}
						onChange={formik.handleChange}
						required
						type="text"
						name="name"
						id="name"
						value={formik.values.name}
					/>
					<input
						type="text"
						placeholder="Address"
						onChange={formik.handleChange}
						name="address"
						id="address"
						value={formik.values.address}
					/>
					<input
						type="number"
						placeholder="Latitude"
						required
						step="any"
						onChange={formik.handleChange}
						name="latitude"
						id="latitude"
						value={formik.values.latitude}
					/>
					<input
						type="number"
						placeholder="Longitude"
						required
						step="any"
						onChange={formik.handleChange}
						name="longitude"
						id="longitude"
						value={formik.values.longitude}
					/>
					<button type="submit">Add Location</button>
				</form>
				{error && <h2>{error}</h2>}
			</div>
		</PageLayout>
	);
};
