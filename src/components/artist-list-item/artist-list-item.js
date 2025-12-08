export class MPGArtistListItem extends HTMLElement {
	/** @param {import("@types").Artist} artist */
	constructor(artist) {
		super();
		this.role = "listitem";

		const title = document.createElement("a");
		title.href = `/artist/${artist.id}`;
		title.innerText = artist.name;

		const image = document.createElement("img");
		image.width = 50;
		image.height = 50;
		image.src = artist.images?.find((image) => image.width === 160)?.url || "";

		this.setAttribute("artist-names", artist.name.toLowerCase());

		this.appendChild(image);
		this.appendChild(title);
	}
}

customElements.define("mpg-artist-list-item", MPGArtistListItem);
