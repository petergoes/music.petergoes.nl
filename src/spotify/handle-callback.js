import { clientId, redirectUri } from "./config.js";

const getToken = async (code) => {
	// stored in the previous step
	const codeVerifier = localStorage.getItem("code_verifier");
	if (!codeVerifier) throw new Error("no code verifier");

	const url = "https://accounts.spotify.com/api/token";
	const payload = {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			code_verifier: codeVerifier,
		}),
	};

	const body = await fetch(url, payload);
	const response = await body.json();

	localStorage.setItem("access_token", response.access_token);

	if (response.refresh_token) {
		localStorage.setItem("refresh_token", response.refresh_token);
	}
};

export const handleCallback = async () => {
	const urlParams = new URLSearchParams(globalThis.location.search);
	const code = urlParams.get("code");

	if (code) {
		await getToken(code);
		location.href = "/";
	}
};
