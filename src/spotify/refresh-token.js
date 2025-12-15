import { clientId } from "./config.js";
import { authenticate } from "./authenticate.js";

/** @type{(value: unknown) => void} */
let resolveHasAccessToken;

/** @type{(value: unknown) => void} */
let rejectHasAccessToken;

export const hasAccessToken = new Promise((resolve, reject) => {
	resolveHasAccessToken = resolve;
	rejectHasAccessToken = reject;
});

export const getRefreshToken = async () => {
	console.log("} Getting Refresh Token");
	// refresh token that has been previously stored
	const refreshToken = localStorage.getItem("refresh_token");
	const url = "https://accounts.spotify.com/api/token";

	if (!refreshToken) {
		authenticate();
		return;
	}

	const payload = {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			client_id: clientId,
		}),
	};
	const body = await fetch(url, payload);
	const response = await body.json();

	if (response.error) {
		authenticate();
		return;
	}

	if (response.expires_in) {
		localStorage.setItem(
			"refresh_token_expires",
			`${Date.now() + (response.expires_in * 1000)}`,
		);
		setTimeout(() => getRefreshToken(), response.expires_in * 1000);
	}

	if (response.access_token) {
		localStorage.setItem("access_token", response.access_token);
	}
	if (response.refresh_token) {
		localStorage.setItem("refresh_token", response.refresh_token);
	}

	console.log("} Refresh token retrieved");
	resolveHasAccessToken(response.access_token);
};
