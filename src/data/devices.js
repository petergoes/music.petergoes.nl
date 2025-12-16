import { apiCall } from "../spotify/api-call.js";
import { Signal, signal } from "@preact/signals-core";
import { getAlbum } from "./albums.js";

/** @type {Signal<string | undefined>} */
export const localWebPlayerDeviceId = signal();

/** @type {Signal<import("@types").Device | undefined>} */
export const activeDevice = signal();

/** @type {Signal<import("@types").Device[] | undefined>} */
export const availableDevices = signal();

/** @type {Signal<import("@types").PlaybackState | undefined>} */
export const playbackState = signal();

export const getAvailableDevices = () => {
	apiCall("/me/player/devices")
		.then(({ devices }) => {
			/** @type {import("@types").Device[]} */
			const filteredDevices = devices
				.filter(({ name, id }) =>
					name !== "Web Player" ||
					id === localWebPlayerDeviceId.peek()
				)
				.map((device) => ({
					...device,
					is_local_web_player: device.id === localWebPlayerDeviceId.peek(),
				}));

			const currentlyActiveDevice = filteredDevices.find((device) =>
				device.is_active
			);

			activeDevice.value = currentlyActiveDevice || activeDevice.peek();
			availableDevices.value = filteredDevices;
		});
};

export const getPlaybackState = async () => {
	/** @type {import("@types").PlaybackState} */
	const state = await apiCall("/me/player");

	const { device } = state || {};
	if (device) {
		activeDevice.value = device;
	}

	const contextId = state.context?.uri.replace(/.+:/, "");
	const artist = await getAlbum(contextId || "").catch(() => {});
	if (artist) {
		state.context.images = artist.images;
	}

	playbackState.value = state;
};
