import { batch } from "@preact/signals-core";
import {
	getAvailableDevices,
	localWebPlayerDeviceId,
} from "../data/devices.js";
import {
	mediaSessionAlbum,
	mediaSessionArtist,
	mediaSessionCover,
	mediaSessionTitle,
} from "../utils/media-session.js";

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
				cb(localStorage.getItem("access_token"));
			},
			volume: 0.5,
		});

		player.addListener("ready", ({ device_id }) => {
			console.log("> Web Player Ready with Device ID", device_id);
			localWebPlayerDeviceId.value = device_id;
			getAvailableDevices();
			window.webplayer = player;
		});

		player.addListener("not_ready", ({ device_id }) => {
			console.log("> !Web player has gone offline", device_id);
			window.webplayer = null;
		});

		player.addListener("player_state_changed", ({
			position,
			duration,
			track_window: { current_track },
		}) => {
			navigator.mediaSession.setPositionState({
				duration: duration / 1000,
				position: position / 1000,
			});

			batch(() => {
				mediaSessionTitle.value = current_track?.name;
				mediaSessionAlbum.value = current_track?.album?.name;
				mediaSessionArtist.value = current_track?.artists?.[0]?.name;
				mediaSessionCover.value = current_track?.album?.images?.[0]?.url;
			});
		});

		player.connect();
	};
};
