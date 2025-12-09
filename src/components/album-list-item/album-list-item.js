import { getArtistsById } from "../../data/artists.js";
import { play } from "../../spotify/player.js";

export class AlbumListItem extends HTMLElement {
	/** @param {import("@types").Album} album */
	constructor(album) {
		super();
		this.role = "listitem";
		this.album = album;

		const playbutton = document.createElement("button");
		playbutton.innerText = "play";
		playbutton.onclick = () => this.handleOnPlay();

		const albumTitle = document.createElement("a");
		albumTitle.innerText = album.name;
		albumTitle.href = `/album/${album.id}`;
		this.setAttribute("album-title", album.name.toLowerCase());

		const artistNames = document.createElement("span");

		this.appendChild(playbutton);
		this.appendChild(albumTitle);
		this.appendChild(artistNames);

		getArtistsById(album.artists).then((artists) => {
			const names = artists.map((artist) => artist.name).join(", ");
			artistNames.innerText = names;
			this.setAttribute("artist-names", names.toLowerCase());
		});
	}

	handleOnPlay() {
		if (this.album.uri) {
			play({ context_uri: this.album.uri });
		}
	}
}

customElements.define("album-list-item", AlbumListItem);
