import { hasAccessToken } from "./refresh-token.js";

/**
 * @param {string} endpoint
 * @param {RequestInit} [init]
 */
export const apiCall = async (endpoint, init = {}) => {
	await hasAccessToken;

	const origin = "https://api.spotify.com/";
	const accessToken = localStorage.getItem("access_token");

	const { headers: initheaders = {}, ...requestInit } = init;

	const headers = new Headers({
		...(initheaders || {}),
		"Authorization": `Bearer ${accessToken}`,
	});

	const endpointToLoad = endpoint.startsWith("https")
		? endpoint
		: `/v1${endpoint}`;

	const url = new URL(endpointToLoad, origin);

	return fetch(url, { ...requestInit, headers }).then(async (response) => {
		if (response.status > 299) {
			const json = await response.json();
			alert(JSON.stringify(json));
		}
		if (response.headers.get("Content-Type")?.includes("application/json")) {
			return response.json();
		}
	});
};
