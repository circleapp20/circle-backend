import { PAGES } from 'base/config/browser/pages';
import { useAuthUser } from 'base/hooks/useAuthUser';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';

interface IPageLayoutProps {
	loading?: boolean;
	children: React.ReactNode;
	authenticated?: boolean;
}

export const PageLayout: React.FC<IPageLayoutProps> = ({ children, loading, authenticated }) => {
	const { replace } = useRouter();
	const { loading: loadUser, user } = useAuthUser();

	if (authenticated && !loadUser && !user) {
		replace(PAGES.AUTH_SIGN_IN);
	}

	return <main>{loading ? <div>Loading page please wait...</div> : children}</main>;
};

PageLayout.propTypes = {
	children: PropTypes.node.isRequired,
	loading: PropTypes.bool,
	authenticated: PropTypes.bool
};
