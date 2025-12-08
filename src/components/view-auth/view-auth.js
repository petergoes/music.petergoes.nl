import { html } from "../../utils/html.js";
import { authenticate } from "../../spotify/authenticate.js";
import { handleCallback } from "../../spotify/handle-callback.js";

export class MPGViewAuth extends HTMLElement {
	connectedCallback() {
		console.log("auth");
		let title;
		if (location.pathname === "/auth") {
			console.log("is auth");
			title = "auth";
			authenticate();
		}

		if (location.pathname === "/auth/callback") {
			console.log("is callback");
			title = "callback";
			handleCallback();
		}

		this.innerHTML = html`
			<h2>${title}</h2>
		`;
	}
}

customElements.define("mpg-view-auth", MPGViewAuth);
