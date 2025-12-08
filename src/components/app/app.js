import "../devices/devices.js";
import { hasAccessToken } from "../../spotify/refresh-token.js";
import { MPGRouter } from "../router/router.js";
import { MPGPlayer } from "../player/player.js";
import { MPGSearch } from "../search/search.js";

export class MPGApp extends HTMLElement {
	constructor() {
		super();
		hasAccessToken.then(() => {
			const searchElement = new MPGSearch();
			const playerElement = new MPGPlayer();
			const routerElement = new MPGRouter();

			this.appendChild(searchElement);
			this.appendChild(routerElement);
			this.appendChild(playerElement);
		});
	}
	connectedCallback() {
	}
}

customElements.define("mpg-app", MPGApp);
