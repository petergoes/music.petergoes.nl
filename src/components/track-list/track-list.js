import { getTrack } from "../../data/tracks.js";
import { TrackListItem } from "../track-list-item/track-list-item.js";

import styles from "./track-list.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class TrackList extends HTMLElement {
	/** @param {import("@types").Track['id'][]} trackIds */
	constructor(trackIds) {
		super();
		this.role = "list";

		trackIds.forEach(async (trackId) => {
			const track = await getTrack(trackId);
			this.append(new TrackListItem(track));
		});
	}
}

customElements.define("track-list", TrackList);
