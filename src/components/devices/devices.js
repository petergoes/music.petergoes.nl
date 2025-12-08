import { getAvailableDevices } from "../../data/devices.js";
import { setActiveDevice } from "../../spotify/active-device.js";

export class MPGDevices extends HTMLElement {
	constructor() {
		super();

		/** @type {import("@types").Device} */
		this.activeDevice;

		/** @type {import("@types").Device[]} */
		this.availableDevices;

		const activeDeviceName = document.createElement("span");

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

		this.appendChild(select);
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

customElements.define("mpg-devices", MPGDevices);
