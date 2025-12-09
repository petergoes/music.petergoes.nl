import "../devices/devices.js";
import { hasAccessToken } from "../../spotify/refresh-token.js";
import { AppRouter } from "../router/router.js";
import { AppPlayer } from "../player/player.js";
import { AppSearch } from "../search/search.js";
import { ArtistList } from "../artist-list/artist-list.js";

import styles from "./app.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AppRoot extends HTMLElement {
	constructor() {
		super();

		hasAccessToken.then(() => {
			const artistList = new ArtistList();
			const routerElement = new AppRouter();
			const playerElement = new AppPlayer();
			const searchElement = new AppSearch();

			this.appendChild(artistList);
			this.appendChild(routerElement);
			this.appendChild(playerElement);
			this.appendChild(searchElement);
		});
	}

	reloadArtistList() {
		this.querySelector("artist-list")?.replaceWith(new ArtistList());
	}
}

customElements.define("app-root", AppRoot);
