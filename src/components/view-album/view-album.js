import { getAlbum } from "../../data/albums.js";
import { getArtistsById } from "../../data/artists.js";
import { TrackList } from "../track-list/track-list.js";
import { AlbumElement } from "../album/album.js";

import styles from "./view-album.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class ViewAlbum extends HTMLElement {
	/** @param {import("@types").Album['id'] | undefined} albumId */
	constructor(albumId) {
		super();

		if (albumId) {
			getAlbum(albumId)
				.then((album) => {
					const albumElement = new AlbumElement(album);
					this.appendChild(albumElement);
				});
		}
	}
}

customElements.define("view-album", ViewAlbum);
