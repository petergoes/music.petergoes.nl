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
 * @param {import("@types").Artist['id']} artistId
 * @param {import("@types").Album['id']} albumId
 */
export const removeAlbumFromArtist = async (artistId, albumId) => {
	console.log("| Remove album from artist", artistId, albumId);
	const artist = await getArtist(artistId);

	const updatedArtist = {
		...artist,
		albums: artist.albums.filter((id) => id !== albumId),
	};

	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	if (updatedArtist.albums.length === 0) {
		console.log("| - Artist has no more albums, deleting artist");
		return Promise.all([tx.store.delete(artistId), tx.done]);
	} else {
		return Promise.all([tx.store.put(updatedArtist), tx.done]);
	}
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

export const batchUpdateArtistImages = async () => {
	const artists = await getArtists();

	const artistWithoutImages = artists
		.filter((artist) => Boolean(artist.images) === false)
		.toSorted((a, b) => a.name.localeCompare(b.name));

	if (artistWithoutImages.length === 0) return false;

	const artistIdsWithoutImages = artistWithoutImages
		.slice(0, 50)
		.map((artist) => artist.id)
		.join(",");

	const remote = await apiCall(
		`/artists?ids=${artistIdsWithoutImages}`,
	);

	/** @type {import("@types").Artist[]} */
	const artistsToUpdate = remote.artists
		.map((remoteArtist) => {
			const localArtist = artists.find((artist) =>
				artist.id === remoteArtist.id
			);
			if (!localArtist) return;

			return { ...localArtist, images: remoteArtist.images };
		})
		.filter(Boolean);

	const db = await getDatabase();
	const tx = db.transaction("artists", "readwrite");
	await Promise.all([
		...artistsToUpdate.map((artist) => {
			console.log("  - Update", artist.name);
			tx.store.put(artist);
		}),
		tx.done,
	]);

	return true;
};
