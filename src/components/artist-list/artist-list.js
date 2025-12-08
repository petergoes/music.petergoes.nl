import { getArtists } from "../../data/artists.js";
import { MPGArtistListItem } from "../artist-list-item/artist-list-item.js";

import styles from "./artist-list.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class MPGArtistList extends HTMLElement {
	constructor() {
		super();
		this.role = "list";

		getArtists()
			.then((artists) => {
				artists.toSorted((a, b) => a.name.localeCompare(b.name)).forEach((
					artist,
				) => this.appendChild(new MPGArtistListItem(artist)));
			});
	}
}

customElements.define("artist-list", MPGArtistList);
