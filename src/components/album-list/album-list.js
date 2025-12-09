import { getAlbum } from "../../data/albums.js";
import { AlbumListItem } from "../album-list-item/album-list-item.js";

import styles from "./album-list.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AlbumList extends HTMLElement {
	/** @param {import("@types").Album[] | import("@types").Album['id'][]} albums */
	constructor(albums) {
		super();
		this.role = "list";

		Promise.all(
			albums.map(async (album) =>
				typeof album === "string" ? await getAlbum(album) : album
			),
		).then((albums) =>
			albums.toSorted((a, b) => b.release_date - a.release_date).forEach(
				(album) => {
					this.appendChild(new AlbumListItem(album));
				},
			)
		);
	}
}

customElements.define("album-list", AlbumList);
