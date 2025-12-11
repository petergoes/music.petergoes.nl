import { getArtistsById } from "../../data/artists.js";
import { play } from "../../spotify/player.js";
import { PlayerButton } from "../player-button/player-button.js";

import styles from "./album-list-item.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AlbumListItem extends HTMLElement {
	/** @type {HTMLImageElement} */
	#cover;

	/** @type {PlayerButton} */
	#playButton;

	/** @param {import("@types").Album} album */
	constructor(album) {
		super();
		this.role = "listitem";
		this.album = album;
		this.id = album.id;
		this.tabIndex = 0;

		this.#playButton = new PlayerButton();
		this.#playButton.icon = "play";
		this.#playButton.iconOnly = true;
		this.#playButton.onclick = this.handleOnPlay;

		this.#cover = document.createElement("img");
		this.#cover.src = album.images?.[0].url;

		const albumTitle = document.createElement("a");
		albumTitle.innerText = album.name;
		albumTitle.href = `/album/${album.id}`;
		this.setAttribute("album-title", album.name.toLowerCase());

		const artistNames = document.createElement("a");

		// this.appendChild(playbutton);
		this.appendChild(this.#cover);
		this.appendChild(this.#playButton);
		this.appendChild(albumTitle);
		this.appendChild(artistNames);

		getArtistsById(album.artists).then((artists) => {
			const names = artists.map((artist) => artist.name).join(", ");
			artistNames.innerText = names;
			artistNames.href = `/artist/${artists[0].id}`;
			this.setAttribute("artist-names", names.toLowerCase());
		});
	}

	handleOnPlay = () => {
		if (this.album.uri) {
			play({ context_uri: this.album.uri });
		}
	};
}

customElements.define("album-list-item", AlbumListItem);
