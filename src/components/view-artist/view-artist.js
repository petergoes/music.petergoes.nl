import { getArtist, updateArtistImages } from "../../data/artists.js";
import { getAlbumsById } from "../../data/albums.js";
import { MPGAlbum } from "../album/album.js";

import styles from "./view-artist.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class ViewArtist extends HTMLElement {
	/** @param {import("@types").Artist['id'] | undefined} artistId */
	constructor(artistId) {
		super();

		const titleElement = document.createElement("h1");

		const image = document.createElement("img");
		image.classList.add("artist-image");
		image.role = "presentation";

		const imageCover = document.createElement("div");
		imageCover.classList.add("artist-image-cover");

		const albumContainer = document.createElement("div");
		albumContainer.classList.add("album-container");

		this.appendChild(image);
		this.appendChild(imageCover);
		this.appendChild(titleElement);
		this.appendChild(albumContainer);

		if (artistId) {
			getArtist(artistId)
				.then((artist) => {
					titleElement.innerText = artist.name;

					if (!artist.images) {
						updateArtistImages(artistId).then((artist) => {
							image.src = artist.images?.[0]?.url || "";
						});
					} else {
						image.src = artist.images?.[0]?.url || "";
					}

					return getAlbumsById(artist.albums);
				})
				.then((albums) => {
					albums.forEach((album) =>
						albumContainer.appendChild(new MPGAlbum(album))
					);
				});
		}
	}
}

customElements.define("view-artist", ViewArtist);
