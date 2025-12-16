import { pause, play } from "../../spotify/player.js";
import { DevicesSelector } from "../devices/devices.js";
import { getPlaybackState, playbackState } from "../../data/devices.js";
import { PlayerButton } from "../player-button/player-button.js";
import { effect } from "@preact/signals-core";

import styles from "./player.css" with { type: "css" };
import { dropDatabase } from "../../data/idb.js";
document.adoptedStyleSheets.push(styles);

export class AppPlayer extends HTMLElement {
	/** @type {PlayerButton} */
	#playButton;

	/** @type {PlayerButton} */
	#pauseButton;

	/** @type {HTMLProgressElement} */
	#progress;

	/** @type {HTMLDivElement} */
	#container;

	/** @type {HTMLSpanElement} */
	#songTitle;

	/** @type {HTMLDivElement} */
	#currentCover;

	constructor() {
		super();

		const filler = document.createElement("img");
		filler.width = 44;
		filler.height = 44;
		filler.src = "/icons/background.svg";
		filler.classList.add("filler");
		filler.onclick = async () => {
			if (confirm("Drop the database?")) {
				if (confirm("sure?")) {
					console.log("dropping database");
					await dropDatabase();
					console.log("reloading");
					location.reload();
				}
			}
		};
		this.appendChild(filler);

		this.#container = document.createElement("div");
		this.#container.classList.add("action-container");

		this.#playButton = new PlayerButton();
		this.#playButton.icon = "play";
		this.#playButton.iconOnly = true;
		this.#playButton.innerText = "Play";
		this.#playButton.onclick = this.handleOnPlay;

		this.#pauseButton = new PlayerButton();
		this.#pauseButton.icon = "pause";
		this.#pauseButton.iconOnly = true;
		this.#pauseButton.innerText = "Pause";
		this.#pauseButton.onclick = this.handleOnPause;

		this.#songTitle = document.createElement("span");

		this.#progress = document.createElement("progress");

		this.#currentCover = document.createElement("div");
		this.#currentCover.classList.add("current-cover");

		const devices = new DevicesSelector();

		this.#container.appendChild(this.#playButton);
		this.#container.appendChild(this.#pauseButton);
		this.#container.appendChild(this.#songTitle);
		this.#container.appendChild(this.#progress);
		this.appendChild(this.#currentCover);
		this.appendChild(this.#container);
		this.appendChild(devices);

		effect(this.updatePlaybackState);
		getPlaybackState();
	}

	updatePlaybackState = () => {
		const state = playbackState.value;

		if (state?.is_playing) {
			this.#playButton.hidden = true;
			this.#pauseButton.hidden = false;
			this.#songTitle.innerText = state.item.name;

			const nextCallInMs = state?.item?.duration_ms - state?.progress_ms < 2000
				? 3000 // less than two seconds remaining, check in three seconds if next has started
				: 2000; // more than two seconds remaning, check again in two seconds;

			setTimeout(() => {
				getPlaybackState();
			}, nextCallInMs);
		} else {
			this.#playButton.hidden = false;
			this.#pauseButton.hidden = true;
			this.#songTitle.innerText = "";
		}

		if (state?.context?.images?.[0]) {
			const currentImage = this.#currentCover.querySelector("img");
			if (currentImage?.src !== state.context.images[0].url) {
				const img = document.createElement("img");
				img.src = state.context.images[0].url;
				this.#currentCover.replaceChildren(img);
			}
		} else {
			this.#currentCover.replaceChildren();
		}

		this.#progress.max = playbackState.value?.item?.duration_ms || 100;
		this.#progress.value = playbackState.value?.progress_ms || 0;
	};

	handleOnPlay = async () => {
		await play();
	};

	handleOnPause = async () => {
		await pause();
	};
}

customElements.define("app-player", AppPlayer);
