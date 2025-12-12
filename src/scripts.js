import { AppRoot } from "./components/app/app.js";
import "./components/album-list-item/album-list-item.js";
import "./components/album-list/album-list.js";
import "./components/main-nav/main-nav.js";
import "./components/player/player.js";
import "./components/router/router.js";
import "./components/track-list-item/track-list-item.js";
import "./components/track-list/track-list.js";
import "./utils/click-interceptor.js";

import { getDatabase } from "./data/idb.js";
import { syncStoredAlbums } from "./data/albums.js";

import { authenticate } from "./spotify/authenticate.js";
import { handleCallback } from "./spotify/handle-callback.js";
import { getRefreshToken } from "./spotify/refresh-token.js";
import { setupWebPlayer } from "./spotify/web-player.js";
import { batchUpdateArtistImages } from "./data/artists.js";
import { getAvailableDevices, getPlaybackState } from "./data/devices.js";

console.log("Music Peter Goes");

if (location.pathname === "/auth") {
	authenticate();
} else if (location.pathname === "/auth/callback") {
	handleCallback();
} else {
	await getRefreshToken();
	console.log("> Spotify authenticated");

	setupWebPlayer();

	await getDatabase();
	console.log("> Database ready");

	/** @type {AppRoot} */
	const app = document.querySelector("app-root") || new AppRoot();
	document.body.appendChild(app);
	console.log("> App rendered");

	let shouldReload = false;
	await syncStoredAlbums().then((syncedAlbums) =>
		shouldReload = syncedAlbums || shouldReload
	);
	console.log("> Stored albums synced, should reload:", shouldReload);

	await batchUpdateArtistImages().then((hasUpdatedArtistImages) =>
		shouldReload = hasUpdatedArtistImages || shouldReload
	);
	console.log("> Artist images up to date");

	if (shouldReload) {
		app.reloadArtistList();
		console.log("  - Reload done");
	}

	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) {
			getPlaybackState();
			getAvailableDevices();
		}
	});
}
