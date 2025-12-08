import { getDatabase } from "./idb.js";

/** @param {import("@types").Track} track */
export const storeTrack = async (track) => {
	const db = await getDatabase();
	const tx = db.transaction("tracks", "readwrite");

	if (!await tx.store.get(track.id)) {
		await Promise.all([
			tx.store.add(track),
			tx.done,
		]);
	}
};

/** @param {import("@types").Track['id']} id */
export const getTrack = async (id) => {
	const db = await getDatabase();
	const tx = db.transaction("tracks", "readwrite");
	return tx.store.get(id);
};
