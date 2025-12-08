import { getTrack } from "../../data/tracks.js";
import { MPGTrackListItem } from "../track-list-item/track-list-item.js";

import styles from "./track-list.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class MPGTrackList extends HTMLElement {
	/** @param {import("@types").Track['id'][]} trackIds */
	constructor(trackIds) {
		super();
		this.role = "list";

		trackIds.forEach(async (trackId) => {
			const track = await getTrack(trackId);
			this.append(new MPGTrackListItem(track));
		});
	}
}

customElements.define("mpg-track-list", MPGTrackList);
