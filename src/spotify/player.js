import { apiCall } from "./api-call.js";
import { getActiveDevice } from "./active-device.js";

/**
 * @param {object} options
 * @param {string[] | null} [options.uris]
 * @param {string | null} [options.context_uri]
 */
export const play = ({ context_uri, uris } = {}) => {
	const activeDevice = getActiveDevice();
	const endpoint = activeDevice.id
		? `/me/player/play?device_id=${activeDevice.id}`
		: "/me/player/play";

	apiCall(endpoint, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ context_uri, uris }),
	});
};

export const pause = () => {
	apiCall("/me/player/pause", {
		method: "put",
	});
};
