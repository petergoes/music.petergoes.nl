import { updateAlbumImages } from "../../data/albums.js";
import { play } from "../../spotify/player.js";
import { AlbumActions } from "../album-actions/album-actions.js";
import { TrackList } from "../track-list/track-list.js";

import styles from "./album.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AlbumElement extends HTMLElement {
	/** @type {HTMLDivElement} */
	#content;

	/** @type {AlbumActions} */
	#actions;

	/** @param {import("@types").Album} album */
	constructor(album) {
		super();
		this.album = album;
		this.setAttribute("album-title", album.name.toLowerCase());
		this.id = album.id;

		this.#content = document.createElement("div");
		this.#content.classList.add("content");
		this.appendChild(this.#content);

		const titleElement = document.createElement("h2");
		titleElement.innerText = album.name;

		const image = document.createElement("img");
		image.width = 300;
		image.src = album.images?.find((image) => image.width === 300)?.url || "";

		const playAlbumButton = document.createElement("button");
		playAlbumButton.ariaLabel = `play ${album.name}`;
		playAlbumButton.onclick = () => this.onPlayAlbum();

		const trackListElement = new TrackList(album.tracks);

		this.#actions = new AlbumActions(album);
		this.#content.appendChild(this.#actions);
		this.#content.appendChild(titleElement);
		this.#content.appendChild(image);
		this.#content.appendChild(playAlbumButton);
		this.#content.appendChild(trackListElement);

		if (!album.images) {
			updateAlbumImages(album.id)
				.then((album) =>
					image.src = album.images?.find((image) => image.width === 300)?.url ||
						""
				);
		}
	}

	onPlayAlbum() {
		if (this.album.uri) {
			play({ context_uri: this.album.uri });
		}
	}
}

customElements.define("album-element", AlbumElement);
