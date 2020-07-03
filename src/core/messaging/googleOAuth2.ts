import { SERVER } from 'base/config/server';
import { google } from 'googleapis';

export const getGoogleOAuth2AccessToken = () => {
	const client = new google.auth.OAuth2(
		SERVER.app.GOOGLE_CLIENT_ID,
		SERVER.app.GOOGLE_CLIENT_SECRET,
		SERVER.externals.OAUTH2_REDIRECT_URL
	);
	client.setCredentials({ refresh_token: SERVER.app.GOOGLE_CLIENT_REFRESH_TOKEN });
	return client.getAccessToken();
};
