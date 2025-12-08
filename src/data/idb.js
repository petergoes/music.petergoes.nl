import { openDB } from "idb";

/**
 * DBSchema for our IDB database using JSDoc.
 *
 * @typedef {Object} MusicData
 * @property {import("@types").Album} albums   - value type of "albums" store
 * @property {string} albums_key               - key type
 *
 * @property {import("@types").Track} tracks   - value type of "tracks" store
 * @property {string} tracks_key               - key type

 * @property {import("@types").Artist} artists - value type of "tracks" store
 * @property {string} artists_key              - key type
 */

/**
 * Open (or create) the database.
 *
 * @returns {Promise<import('idb').IDBPDatabase<MusicData>>}
 */
export const getDatabase = () =>
	openDB("music_data", 1, {
		upgrade(db) {
			const albums = db.createObjectStore("albums", {
				keyPath: "id",
			});
			albums.createIndex("name", "name");

			const tracks = db.createObjectStore("tracks", {
				keyPath: "id",
			});
			tracks.createIndex("name", "name");

			const artists = db.createObjectStore("artists", {
				keyPath: "id",
			});
			artists.createIndex("name", "name");
		},
	});

/** @param {import('@types').Album[]} albums */
export const addAlbums = async (albums) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");

	await Promise.all([
		...albums.map((album) => tx.store.add(album)),
		tx.done,
	]);

	return albums;
};

/** @param {import('@types').Album} album */
export const addAlbum = async (album) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	const existing = await tx.store.get(album.id);

	if (!existing) {
		await Promise.all([
			tx.store.add(album),
			tx.done,
		]);
	}

	return existing || album;
};

/**
 * @param {import('@types').Album['id']} albumId
 * @returns {Promise<import('@types').Album>}
 */
export const getAlbum = async (albumId) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");

	/** @type {import('@types').Album | null} */
	const album = tx.store.get(albumId);

	if (album) {
		return album;
	}
};

export const getAlbums = async () => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	return tx.store.getAll();
};

/** @param {import('@types').Track[]} tracks */
export const addTracks = async (tracks) => {
	const db = await getDatabase();
	const tx = db.transaction("tracks", "readwrite");

	await Promise.all([
		...tracks.map((track) => tx.store.add(track)),
		tx.done,
	]);

	return tracks;
};
/**
 * @param {import('@types').Track['id']} trackId
 * @returns {Promise<import('@types').Track>}
 */
export const getTrack = async (trackId) => {
	const db = await getDatabase();
	const tx = db.transaction("tracks", "readwrite");

	/** @type {import('@types').Track | null} */
	const track = tx.store.get(trackId);

	if (track) {
		return track;
	}
};
