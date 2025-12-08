/** @type {import("@types").Device} */
let activeDevice;

/** @param {import("@types").Device} newActiveDevice */
export const setActiveDevice = (newActiveDevice) => {
	activeDevice = newActiveDevice;
};

/** @returns {import("@types").Device} */
export const getActiveDevice = () => {
	return activeDevice;
};
