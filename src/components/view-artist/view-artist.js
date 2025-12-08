import { getArtist, updateArtistImages } from "../../data/artists.js";
import { getAlbumsById } from "../../data/albums.js";
import { MPGAlbum } from "../album/album.js";

export class MPGViewArtist extends HTMLElement {
	/** @param {import("@types").Artist['id'] | undefined} artistId */
	constructor(artistId) {
		super();

		const titleElement = document.createElement("h1");

		const image = document.createElement("img");
		image.width = 640;
		image.height = 640;

		this.appendChild(titleElement);
		this.appendChild(image);

		if (artistId) {
			getArtist(artistId)
				.then((artist) => {
					titleElement.innerText = artist.name;

					if (!artist.images) {
						updateArtistImages(artistId).then((artist) => {
							image.src = artist.images?.find((image) =>
								image.width === 640
							)?.url || "";
						});
					} else {
						image.src = artist.images.find((image) =>
							image.width === 640
						)?.url || "";
					}

					return getAlbumsById(artist.albums);
				})
				.then((albums) => {
					albums.forEach((album) => this.appendChild(new MPGAlbum(album)));
				});
		}
	}
}

customElements.define("mpg-view-artist", MPGViewArtist);
