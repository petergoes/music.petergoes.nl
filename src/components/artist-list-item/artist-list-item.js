import styles from "./artist-list-item.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class ArtistListItem extends HTMLElement {
	/** @type {HTMLAnchorElement} */
	#titleElement;

	/** @param {import("@types").Artist} artist */
	constructor(artist) {
		super();
		this.role = "listitem";

		const image = document.createElement("img");
		image.width = 160;
		image.role = "presentation";
		image.src = artist.images?.at(0)?.url || "";

		this.#titleElement = document.createElement("a");
		this.#titleElement.href = `/artist/${artist.id}`;
		this.#titleElement.innerText = artist.name;

		this.setAttribute("artist-names", artist.name.toLowerCase());

		this.appendChild(image);
		this.appendChild(this.#titleElement);
	}

	connectedCallback() {
		this.addEventListener("click", () => this.navigateToArtist());
	}

	navigateToArtist() {
		this.#titleElement.click();
	}
}

customElements.define("artist-list-item", ArtistListItem);
