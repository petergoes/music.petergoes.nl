import { apiCall } from "../spotify/api-call.js";

/** @returns {Promise<import("@types").Device[]>} */
export const getAvailableDevices = () => {
	return apiCall("/me/player/devices").then((result) => result.devices);
};
