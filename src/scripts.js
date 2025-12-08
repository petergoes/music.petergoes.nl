import { MPGApp } from "./components/app/app.js";
import "./components/album-list-item/album-list-item.js";
import "./components/album-list/album-list.js";
import "./components/main-nav/main-nav.js";
import "./components/player/player.js";
import "./components/router/router.js";
import "./components/track-list-item/track-list-item.js";
import "./components/track-list/track-list.js";

import { getDatabase } from "./data/idb.js";
import { loadSavedAlbums } from "./data/albums.js";

import { authenticate } from "./spotify/authenticate.js";
import { handleCallback } from "./spotify/handle-callback.js";
import { getRefreshToken } from "./spotify/refresh-token.js";

console.log("Music Peter Goes");

if (location.pathname === "/auth") {
	authenticate();
} else if (location.pathname === "/auth/callback") {
	handleCallback();
} else {
	await getRefreshToken();
	console.log("> Spotify authenticated");

	await getDatabase();
	console.log("> Database ready");

	await loadSavedAlbums();
	console.log("> Saved albums loaded");

	const existingApp = document.querySelector("mpg-app");
	if (!existingApp) {
		document.body.appendChild(new MPGApp());
	}
}
