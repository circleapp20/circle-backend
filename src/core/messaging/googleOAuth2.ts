import { Constants } from 'base/config/node/constants';
import { google } from 'googleapis';

export const getGoogleOAuth2AccessToken = () => {
	const client = new google.auth.OAuth2(
		Constants.app.GOOGLE_CLIENT_ID,
		Constants.app.GOOGLE_CLIENT_SECRET,
		Constants.externals.OAUTH2_REDIRECT_URL
	);
	client.setCredentials({ refresh_token: Constants.app.GOOGLE_CLIENT_REFRESH_TOKEN });
	return client.getAccessToken();
};
