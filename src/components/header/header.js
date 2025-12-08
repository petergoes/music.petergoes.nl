import { AppSearch } from "../search/search.js";

export class AppHeader extends HTMLElement {
	/** @type {AppSearch} */
	#searchElement;

	constructor() {
		super();

		this.#searchElement = new AppSearch();

		this.appendChild(this.#searchElement);
	}
}

customElements.define("app-header", AppHeader);
