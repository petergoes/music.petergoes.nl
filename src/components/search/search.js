import { currentUrl } from "../../utils/click-interceptor.js";

const searchSheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(searchSheet);

export class AppSearch extends HTMLElement {
	/** @type {HTMLDialogElement} */
	#dialog;

	/** @type {HTMLFormElement} */
	#formElement;

	constructor() {
		super();

		this.#dialog = document.createElement("dialog");
		this.#dialog.setAttribute("closedby", "any");
		this.appendChild(this.#dialog);

		this.#formElement = document.createElement("form");
		this.#formElement.onsubmit = this.onFormSubmit;

		const inputField = document.createElement("input");
		inputField.type = "search";
		inputField.name = "search";
		inputField.oninput = () => this.updateSearchStyles(inputField);

		this.#formElement.appendChild(inputField);
		this.#dialog.appendChild(this.#formElement);
	}

	connectedCallback() {
		document.addEventListener("keydown", this.onShowModal);
		currentUrl.subscribe(this.resetForm);
	}

	disconnectedCallback() {
		document.removeEventListener("keydown", this.onShowModal);
	}

	resetForm = () => {
		this.#formElement.reset();
		this.clearSearchStyles();
	};

	onShowModal = (event) => {
		if (event.key === "k" && event.metaKey) {
			this.#dialog.showModal();
		}
	};

	onFormSubmit = (event) => {
		event.preventDefault();
		this.#dialog.close();
	};

	updateSearchStyles(inputField) {
		const value = inputField.value;
		if (value) {
			searchSheet.replaceSync(`
					:where([artist-names]) { display: none !important; }
					[artist-names*="${value}"] { display: grid !important; }
					[album-title*="${value}"] { display: grid !important; }
			`);
		} else {
			this.clearSearchStyles();
		}
	}

	clearSearchStyles() {
		searchSheet.replaceSync("");
	}
}

customElements.define("app-search", AppSearch);
