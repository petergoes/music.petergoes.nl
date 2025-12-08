import { MPGArtistList } from "../artist-list/artist-list.js";

export class MPGViewHome extends HTMLElement {
	constructor() {
		super();

		const title = document.createElement("h1");
		title.innerText = "Home";

		const artistsList = new MPGArtistList();

		this.appendChild(title);
		this.appendChild(artistsList);
	}
}

customElements.define("mpg-view-home", MPGViewHome);
