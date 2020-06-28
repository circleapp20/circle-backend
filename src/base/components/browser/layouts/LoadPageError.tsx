import PropTypes from 'prop-types';
import React from 'react';

interface ILoadPageErrorProps {
	error: string;
	children: React.ReactNode;
}

export const LoadPageError: React.FC<ILoadPageErrorProps> = ({ error, children }) => {
	const errorDetails = () => (
		<div>
			<h1>Oops! An error!</h1>
			<p>An error has occurred whilst loading your page. Please try again</p>
			<small>Error code: {error}</small>
		</div>
	);

	return <>{error ? errorDetails() : children}</>;
};

LoadPageError.propTypes = {
	error: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
};
