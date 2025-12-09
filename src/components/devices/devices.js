import { getAvailableDevices } from "../../data/devices.js";
import { setActiveDevice } from "../../spotify/active-device.js";

export class DevicesSelector extends HTMLElement {
	constructor() {
		super();

		/** @type {import("@types").Device} */
		this.activeDevice;

		/** @type {import("@types").Device[]} */
		this.availableDevices;

		const activeDeviceName = document.createElement("button");
		activeDeviceName.setAttribute("commandfor", "device-selector-dialog");
		activeDeviceName.command = "show-modal";

		const dialog = document.createElement("dialog");
		dialog.id = "device-selector-dialog";

		const select = document.createElement("select");
		select.onchange = (event) => {
			const value = event.target.value;

			const newActiveDevice = this.availableDevices.find((device) =>
				device.id === value
			);
			if (newActiveDevice) {
				setActiveDevice(newActiveDevice);
				activeDeviceName.innerText = newActiveDevice.name;
			}
		};

		dialog.appendChild(select);
		this.appendChild(dialog);
		this.appendChild(activeDeviceName);

		getAvailableDevices().then((devices) => {
			this.availableDevices = devices;
			this.activeDevice = devices[0];
			setActiveDevice(this.activeDevice);
			activeDeviceName.innerText = this.activeDevice.name;

			select.innerHTML = "";

			devices.map((device) => {
				const option = document.createElement("option");
				option.value = device.id;
				option.innerText = device.name;
				select.appendChild(option);
			});
		});
	}
}

customElements.define("devices-selector", DevicesSelector);
