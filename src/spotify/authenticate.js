import { authUrl, clientId, redirectUri, scope } from "./config.js";

const generateRandomString = (length) => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return globalThis.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
};

export const authenticate = async () => {
	const codeVerifier = generateRandomString(64);
	const hashed = await sha256(codeVerifier);
	const codeChallenge = base64encode(hashed);

	// generated in the previous step
	globalThis.localStorage.setItem("code_verifier", codeVerifier);

	const params = {
		response_type: "code",
		client_id: clientId,
		scope: scope.join(" "),
		code_challenge_method: "S256",
		code_challenge: codeChallenge,
		redirect_uri: redirectUri,
	};

	authUrl.search = new URLSearchParams(params).toString();
	globalThis.location.href = authUrl.toString();
	console.log("GOING TO AUTHENTICATE");
};
