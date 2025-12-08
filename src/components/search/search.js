const searchSheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(searchSheet);

export class AppSearch extends HTMLElement {
	constructor() {
		super();

		navigation.addEventListener("navigate", () => {
			formElement.reset();
			this.clearSearchStyles();
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "k" && event.metaKey) {
				inputField.focus();
			}
		});

		const formElement = document.createElement("form");

		const inputField = document.createElement("input");
		inputField.type = "search";
		inputField.name = "search";
		inputField.oninput = () => this.updateSearchStyles(inputField);

		formElement.appendChild(inputField);
		this.appendChild(formElement);
	}

	updateSearchStyles(inputField) {
		const value = inputField.value;
		if (value) {
			searchSheet.replaceSync(`
					:where([artist-names], [album-title], [track-name]) { display: none !important; }
					[artist-names*="${value}"] { display: block !important; }
					[album-title*="${value}"] { display: block !important; }
					[track-name*="${value}"] { display: block !important; }
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
