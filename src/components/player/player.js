import { pause, play } from "../../spotify/player.js";
import { MPGDevices } from "../devices/devices.js";

import styles from "./player.css" with { type: "css" };
document.adoptedStyleSheets.push(styles);

export class AppPlayer extends HTMLElement {
	constructor() {
		super();

		const playButton = document.createElement("button");
		playButton.innerText = "Play";
		playButton.onclick = this.handleOnPlay;

		const pauseButton = document.createElement("button");
		pauseButton.innerText = "Pause";
		pauseButton.onclick = this.handleOnPause;

		const devices = new MPGDevices();

		this.appendChild(playButton);
		this.appendChild(pauseButton);
		this.appendChild(devices);
	}

	handleOnPlay() {
		play();
	}

	handleOnPause() {
		pause();
	}
}

customElements.define("app-player", AppPlayer);
