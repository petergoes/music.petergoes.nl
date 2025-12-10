import { apiCall } from "./api-call.js";
import {
	activeDevice,
	getAvailableDevices,
	getPlaybackState,
} from "../data/devices.js";

/**
 * @param {object} options
 * @param {string[] | null} [options.uris]
 * @param {string | null} [options.context_uri]
 */
export const play = async ({ context_uri, uris } = {}) => {
	const device = activeDevice.peek();
	const endpoint = device?.id
		? `/me/player/play?device_id=${device.id}`
		: "/me/player/play";

	await apiCall(endpoint, {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ context_uri, uris }),
	});

	getPlaybackState();
};

export const pause = async () => {
	await apiCall("/me/player/pause", {
		method: "put",
	});
	getPlaybackState();
};

/** @param {import("@types").Device['id']} deviceId */
export const transfer = async (deviceId) => {
	const device = activeDevice.peek();

	if (!deviceId || deviceId === device?.id) return;

	await apiCall("/me/player", {
		method: "put",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			device_ids: [deviceId],
		}),
	});

	getAvailableDevices();
};
