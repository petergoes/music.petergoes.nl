import { getAlbums } from "../../data/albums.js";
import { MPGAlbumList } from "../album-list/album-list.js";

export class MPGViewAlbums extends HTMLElement {
	constructor() {
		super();

		const title = document.createElement("h1");
		title.innerText = "Albums";

		this.appendChild(title);

		getAlbums().then((albums) => this.appendChild(new MPGAlbumList(albums)));
	}
}

customElements.define("mpg-view-albums", MPGViewAlbums);
