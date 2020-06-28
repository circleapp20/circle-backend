import { processApiResponseError } from 'base/errors/browser/processApiResponseError';
import React from 'react';
import useSWR from 'swr';

export const useGet = <T>(url: string, fetchApiFunction: () => Promise<T>) => {
	const [loading, setLoading] = React.useState(true);
	const [processedError, setProcessedError] = React.useState('');
	const { data, error } = useSWR(url, fetchApiFunction);

	const isMounted = React.useRef(true);

	React.useEffect(() => {
		if (!isMounted.current) return;
		if (data || error) setLoading(false);
		if (error) {
			const { error: e } = processApiResponseError(error);
			setProcessedError(e);
		}
	}, [data, error]);

	React.useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	return { error: processedError, data, loading };
};
