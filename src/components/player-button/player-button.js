/**
 * @enum {string}
 */
const icons = {
	eject: "/icons/eject.svg",
	music: "/icons/music.svg",
	musicOff: "/icons/music-off.svg",
	pause: "/icons/pause.svg",
	play: "/icons/play.svg",
	playlist: "/icons/playlist.svg",
	playlistOff: "/icons/playlist-off.svg",
	playlistX: "/icons/playlist-x.svg",
	record: "/icons/record.svg",
	repeat: "/icons/repeat.svg",
	repeatOff: "/icons/repeat-off.svg",
	repeatOnce: "/icons/repeat-once.svg",
	shareplay: "/icons/shareplay.svg",
	skipBack: "/icons/slip-back.svg",
	skipForward: "/icons/skip-forward.svg",
	stop: "/icons/stop.svg",
	trackNext: "/icons/track-next.svg",
	trackPrev: "/icons/track-prev.svg",
	volume: "/icons/volume.svg",
	volumeOff: "/icons/volume-off.svg",
};

const styles = new CSSStyleSheet();
styles.replaceSync(`
	:host {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	button {
		appearance: none;
		display: flex;
		padding: 10px;
		margin: 0;
		border: 1px solid transparent;
		border-radius: 8px;
	}
	button[data-icon-only] {
		border-radius: 100%;
	}
`);

export class PlayerButton extends HTMLElement {
	/** @type {HTMLButtonElement} */
	#button;

	/** @type {HTMLSpanElement} */
	#label;

	/** @type {HTMLImageElement} */
	#icon;

	constructor() {
		super();
		this.#button = document.createElement("button");
		this.#label = document.createElement("span");
		this.#icon = document.createElement("img");
		this.#icon.width = 24;
		this.#icon.height = 24;
		this.#button.appendChild(this.#icon);
		this.#button.appendChild(this.#label);
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: "open" });
		shadow.adoptedStyleSheets.push(styles);

		const slot = document.createElement("slot");

		this.#label.appendChild(slot);
		shadow.appendChild(this.#button);
	}

	/** @param {keyof typeof icons} value */
	set icon(value) {
		this.#icon.src = icons[value];
	}

	/** @param {Boolean} value */
	set iconOnly(value) {
		this.#label.hidden = value;
		this.#button.dataset.iconOnly = value ? "" : undefined;
	}

	/** @param {HTMLElement} value */
	set popoverTargetElement(value) {
		this.#button.popoverTargetElement = value;
	}

	/** @param {string} value */
	set popoverTargetAction(value) {
		this.#button.popoverTargetAction = value;
	}
}

customElements.define("player-button", PlayerButton);
