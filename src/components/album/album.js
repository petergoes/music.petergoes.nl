import { updateAlbumImages } from "../../data/albums.js";
import { play } from "../../spotify/player.js";
import { MPGTrackList } from "../track-list/track-list.js";

export class MPGAlbum extends HTMLElement {
	/** @param {import("@types").Album} album */
	constructor(album) {
		super();
		this.album = album;
		this.setAttribute("album-title", album.name.toLowerCase());
		this.id = album.id;

		const titleElement = document.createElement("h2");
		titleElement.innerText = album.name;

		const image = document.createElement("img");
		image.width = 300;
		image.height = 300;
		image.src = album.images?.find((image) => image.width === 300)?.url || "";

		const playAlbumButton = document.createElement("button");
		playAlbumButton.innerText = "play album";
		playAlbumButton.onclick = () => this.onPlayAlbum();

		const trackListElement = new MPGTrackList(album.tracks);

		this.appendChild(titleElement);
		this.appendChild(image);
		this.appendChild(playAlbumButton);
		this.appendChild(trackListElement);

		if (!album.images) {
			console.log("no image");
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

customElements.define("mpg-album", MPGAlbum);
