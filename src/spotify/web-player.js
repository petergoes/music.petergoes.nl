import {
	getAvailableDevices,
	localWebPlayerDeviceId,
} from "../data/devices.js";

export const setupWebPlayer = () => {
	const accessToken = localStorage.getItem("access_token");

	if (!accessToken) {
		throw new Error("No access token");
	}

	const script = document.createElement("script");
	script.src = "https://sdk.scdn.co/spotify-player.js";
	script.async = true;

	document.body.appendChild(script);

	window.onSpotifyWebPlaybackSDKReady = () => {
		const player = new window.Spotify.Player({
			name: "Web Player",
			getOAuthToken: (cb) => {
				cb(accessToken);
			},
			volume: 0.5,
		});

		player.addListener("ready", ({ device_id }) => {
			console.log("> Web Player Ready with Device ID", device_id);
			localWebPlayerDeviceId.value = device_id;
			getAvailableDevices();
		});

		player.addListener("not_ready", ({ device_id }) => {
			console.log("> !Web player has gone offline", device_id);
		});

		player.connect();
	};
};
