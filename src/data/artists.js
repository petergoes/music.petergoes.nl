import { apiCall } from "../spotify/api-call.js";
import { getDatabase } from "./idb.js";

/** @param {import("@types").Artist} artist */
export const storeArtist = async (artist) => {
	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");

	/** @type {Partial<import("@types").Artist> & {albums: import("@types").Album[]}} */
	const storedArtist = (await tx.store.get(artist.id)) || { albums: [] };
	artist.albums = [...new Set([...artist.albums, ...storedArtist.albums])];
	artist.images = storedArtist.images;

	await Promise.all([
		tx.store.put(artist),
		tx.done,
	]);

	return artist;
};

/**
 * @param {import("@types").Artist['id']} id
 * @returns {Promise<import("@types").Artist>}
 */
export const updateArtistImages = async (id) => {
	const remoteArtist = await apiCall(`/artists/${id}`);

	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	const storedArtist = await tx.store.get(id);
	const updatedArtist = { ...storedArtist, images: remoteArtist.images };
	await tx.store.put(updatedArtist);
	await tx.done;
	return updatedArtist;
};

/**
 * @param {import("@types").Artist['id']} id
 * @returns {Promise<import("@types").Artist>}
 */
export const getArtist = async (id) => {
	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	return tx.store.get(id);
};

/**
 * @returns {Promise<import("@types").Artist[]>}
 */
export const getArtists = async () => {
	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	return tx.store.getAll();
};

/**
 * @param {import("@types").Artist['id'][]} ids
 * @returns {Promise<import("@types").Artist[]>}
 */
export const getArtistsById = async (ids) => {
	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	return Promise.all([
		...ids.map((id) => tx.store.get(id)),
		tx.done,
	]).then((result) => {
		result.pop();
		return result;
	});
};
