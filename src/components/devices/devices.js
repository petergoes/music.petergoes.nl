import {
	activeDevice,
	availableDevices,
	getAvailableDevices,
} from "../../data/devices.js";
import { effect } from "@preact/signals-core";
import { transfer } from "../../spotify/player.js";

export class DevicesSelector extends HTMLElement {
	/** @type {HTMLSelectElement} */
	#select;

	constructor() {
		super();

		this.#select = document.createElement("select");
		this.#select.onchange = this.changePlayer;
		this.appendChild(this.#select);

		getAvailableDevices();

		effect(this.updateOptions);

		// Set active device value
		effect(() => {
			this.#select
				.querySelectorAll("option")
				.forEach((option) =>
					option.selected = option.value === activeDevice?.value?.id
				);
		});
	}

	/** @param {Event} event */
	changePlayer = (event) => {
		console.log("> Transfer playback to:", event.target.value);
		const deviceId = event.target.value;
		transfer(deviceId);
	};

	// update device list options
	updateOptions = () => {
		const devices = availableDevices.value || [];
		const deviceIds = devices.map((device) => device.id);

		const options = Array.from(this.#select.querySelectorAll("option"));

		// remove obsolete items
		options.forEach((option) => {
			if (deviceIds.includes(option.value) === false) {
				option.remove();
			}
		});

		devices.forEach((device) => {
			const existingOption = options.find((option) =>
				option.value === device.id
			);
			if (Boolean(existingOption) === false) {
				const option = document.createElement("option");
				option.value = device.id;
				option.innerText = device.name;

				this.#select.appendChild(option);
			}
		});
	};
}

customElements.define("devices-selector", DevicesSelector);
