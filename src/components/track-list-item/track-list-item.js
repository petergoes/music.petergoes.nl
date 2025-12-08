import { play } from "../../spotify/player.js";

export class MPGTrackListItem extends HTMLElement {
	/** @param {import("@types").Track} track */
	constructor(track) {
		super();
		this.role = "listitem";
		this.track = track;

		const playbutton = document.createElement("button");
		playbutton.innerText = "play";
		playbutton.onclick = () => this.handleOnPlay();

		const trackName = document.createElement("span");
		trackName.innerText = track.name;
		this.setAttribute("track-name", track.name.toLowerCase());

		this.appendChild(playbutton);
		this.appendChild(trackName);
	}

	handleOnPlay() {
		if (this.track.uri) {
			play({ uris: [this.track.uri] });
		}
	}
}

customElements.define("mpg-track-list-item", MPGTrackListItem);
