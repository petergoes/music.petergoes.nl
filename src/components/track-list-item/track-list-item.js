import { play } from "../../spotify/player.js";

import styles from "./track-list-item.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class TrackListItem extends HTMLElement {
	/** @param {import("@types").Track} track */
	constructor(track) {
		super();
		this.role = "listitem";
		this.track = track;

		const trackName = document.createElement("span");
		trackName.innerText = track.name;
		this.setAttribute("track-name", track.name.toLowerCase());

		if (track.disk_number) {
			this.setAttribute("disk-number", track.disk_number);
		}

		this.appendChild(trackName);
	}

	handleOnPlay() {
		if (this.track.uri) {
			play({ uris: [this.track.uri] });
		}
	}
}

customElements.define("track-list-item", TrackListItem);
