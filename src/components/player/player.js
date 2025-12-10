import { pause, play } from "../../spotify/player.js";
import { DevicesSelector } from "../devices/devices.js";
import { getPlaybackState, playbackState } from "../../data/devices.js";
import { effect } from "@preact/signals-core";

import styles from "./player.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AppPlayer extends HTMLElement {
	/** @type {HTMLButtonElement} */
	#playButton;

	/** @type {HTMLButtonElement} */
	#pauseButton;

	/** @type {HTMLProgressElement} */
	#progress;

	/** @type {HTMLDivElement} */
	#container;

	/** @type {HTMLSpanElement} */
	#songTitle;

	constructor() {
		super();

		this.#container = document.createElement("div");
		this.#container.classList.add("action-container");

		this.#playButton = document.createElement("button");
		this.#playButton.innerText = "Play";
		this.#playButton.onclick = this.handleOnPlay;

		this.#pauseButton = document.createElement("button");
		this.#pauseButton.innerText = "Pause";
		this.#pauseButton.onclick = this.handleOnPause;

		this.#songTitle = document.createElement("span");

		this.#progress = document.createElement("progress");

		const devices = new DevicesSelector();

		this.#container.appendChild(this.#playButton);
		this.#container.appendChild(this.#pauseButton);
		this.#container.appendChild(this.#songTitle);
		this.#container.appendChild(this.#progress);
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
