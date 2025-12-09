import { getAlbums } from "../../data/albums.js";
import { AlbumList } from "../album-list/album-list.js";

export class ViewAlbums extends HTMLElement {
	constructor() {
		super();

		const title = document.createElement("h1");
		title.innerText = "Albums";

		this.appendChild(title);

		getAlbums().then((albums) => this.appendChild(new AlbumList(albums)));
	}
}

customElements.define("view-albums", ViewAlbums);
