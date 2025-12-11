import { removeAlbumFromOrigin } from "../../spotify/player.js";
import { PlayerButton } from "../player-button/player-button.js";

export class AlbumActions extends HTMLElement {
	/** @type {PlayerButton} */
	#trigger;

	/** @type {HTMLDivElement} */
	#popup;

	/** @type {HTMLDialogElement} */
	#confirmDialog;

	/** @param {import("@types").Album} album */
	constructor(album) {
		super();

		this.#popup = document.createElement("div");
		this.#popup.popover = "auto";

		const deleteButton = new PlayerButton();
		deleteButton.icon = "eject";
		deleteButton.innerText = "Remove this album from library";
		deleteButton.onclick = () => this.deleteAlbum(album);

		const cancelButton = new PlayerButton();
		cancelButton.innerText = "cancel";
		cancelButton.popoverTargetElement = this.#popup;
		cancelButton.popoverTargetAction = "hide";

		this.#popup.appendChild(cancelButton);
		this.#popup.appendChild(deleteButton);

		this.#trigger = new PlayerButton();
		this.#trigger.icon = "record";
		this.#trigger.iconOnly = true;
		this.#trigger.popoverTargetElement = this.#popup;

		this.appendChild(this.#trigger);
		this.appendChild(this.#popup);
	}

	/** @param {import("@types").Album} album */
	deleteAlbum = async (album) => {
		await removeAlbumFromOrigin(album);
		// window.location.reload();
	};
}

customElements.define("album-actions", AlbumActions);
