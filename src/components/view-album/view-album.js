import { getAlbum } from "../../data/albums.js";
import { getArtistsById } from "../../data/artists.js";
import { MPGTrackList } from "../track-list/track-list.js";

export class MPGViewAlbum extends HTMLElement {
	/** @param {import("@types").Album['id'] | undefined} albumId */
	constructor(albumId) {
		super();

		const titleElement = document.createElement("h1");
		const albumTitleElement = document.createElement("span");
		const artistNameElement = document.createElement("span");

		titleElement.appendChild(albumTitleElement);
		titleElement.appendChild(document.createTextNode(" - "));
		titleElement.appendChild(artistNameElement);

		this.appendChild(titleElement);

		if (albumId) {
			getAlbum(albumId).then((album) => {
				albumTitleElement.innerText = album.name;

				const trackListElement = new MPGTrackList(album.tracks);
				this.appendChild(trackListElement);

				getArtistsById(album.artists).then((artists) =>
					artistNameElement.innerText = artists.map((artist) => artist.name)
						.join(", ")
				);
			});
		}
	}
}

customElements.define("mpg-view-album", MPGViewAlbum);
