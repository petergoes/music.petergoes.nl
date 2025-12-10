import { getAvailableDevices } from "../../data/devices.js";
import { setActiveDevice } from "../../spotify/active-device.js";

export class DevicesSelector extends HTMLElement {
	/** @type {HTMLButtonElement} */
	#activeDeviceName;

	/** @type {HTMLSelectElement} */
	#select;

	constructor() {
		super();

		/** @type {import("@types").Device} */
		this.activeDevice;

		/** @type {import("@types").Device[]} */
		this.availableDevices;

		this.#activeDeviceName = document.createElement("button");
		this.#activeDeviceName.setAttribute("commandfor", "device-selector-dialog");
		this.#activeDeviceName.command = "show-modal";

		const dialog = document.createElement("dialog");
		dialog.id = "device-selector-dialog";
		dialog.setAttribute("closeby", "any");

		this.#select = document.createElement("select");
		this.#select.onchange = (event) => {
			const value = event.target.value;

			const newActiveDevice = this.availableDevices.find((device) =>
				device.id === value
			);
			if (newActiveDevice) {
				setActiveDevice(newActiveDevice);
				this.#activeDeviceName.innerText = newActiveDevice.name;
			}

			dialog.close();
		};

		dialog.appendChild(this.#select);
		this.appendChild(dialog);
		this.appendChild(this.#activeDeviceName);
	}

	updateDevicesList = () => {
		getAvailableDevices().then((devices) => {
			this.availableDevices = devices;
			this.activeDevice = devices[0];
			setActiveDevice(this.activeDevice);
			this.#activeDeviceName.innerText = this.activeDevice.name;

			this.#select.innerHTML = "";

			devices.map((device) => {
				const option = document.createElement("option");
				option.value = device.id;
				option.innerText = device.name;
				this.#select.appendChild(option);
			});
		});
	};
}

customElements.define("devices-selector", DevicesSelector);
