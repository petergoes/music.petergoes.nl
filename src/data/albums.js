import { apiCall } from "../spotify/api-call.js";
import { getDatabase } from "./idb.js";
import { storeArtist } from "./artists.js";
import { storeTrack } from "./tracks.js";

const storeAlbum = async (remoteAlbum) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");

	/** @type {import("@types").Album} */
	const album = {
		added_at: new Date(remoteAlbum.added_at).getTime(),
		artists: remoteAlbum.artists.map((remoteArtist) => remoteArtist.id),
		href: remoteAlbum.href,
		id: remoteAlbum.id,
		images: remoteAlbum.images,
		label: remoteAlbum.label,
		name: remoteAlbum.name,
		release_date: new Date(remoteAlbum.release_date).getTime(),
		total_tracks: remoteAlbum.total_tracks,
		tracks: remoteAlbum.tracks.items.map((remoteTrack) => remoteTrack.id),
		uri: remoteAlbum.uri,
	};
	if (!await tx.store.get(album.id)) {
		console.log(" - Save album:", album.name);
		await Promise.all([tx.store.add(album), tx.done]);
	}

	const trackPromises = remoteAlbum.tracks.items.map(
		/** @returns {import("@types").Track} */
		(remoteTrack) => ({
			artists: remoteTrack.artists.map((artist) => artist.id),
			disk_number: remoteTrack.disk_number,
			duration_ms: remoteTrack.duration_ms,
			href: remoteTrack.href,
			id: remoteTrack.id,
			name: remoteTrack.name,
			track_number: remoteTrack.track_number,
			uri: remoteTrack.uri,
		}),
	).map(
		/** @param {import("@types").Track} track */
		(track) => storeTrack(track),
	);

	const artistPromises = remoteAlbum.artists.map(
		/** @returns {import("@types").Artist} */
		(remoteArtist) => ({
			albums: [album.id],
			href: remoteArtist.href,
			id: remoteArtist.id,
			name: remoteArtist.name,
			uri: remoteArtist.uri,
		}),
	).map(
		/** @param {import("@types").Artist} artist */
		(artist) => storeArtist(artist),
	);

	await Promise.all([...artistPromises, ...trackPromises].flat());
};

export const syncStoredAlbums = async (endpoint) => {
	const localAlbums = await getAlbums();
	const remoteAlbums = await apiCall(endpoint || `/me/albums`);

	await Promise.all([
		remoteAlbums.items.map((remoteAlbum) =>
			storeAlbum({ added_at: remoteAlbum.added_at, ...remoteAlbum.album })
		),
	]);

	if (localAlbums.length < remoteAlbums.total) {
		if (remoteAlbums.next) {
			await syncStoredAlbums(remoteAlbums.next);
			return true;
		}
	} else {
		console.log("  - Total local albums: ", localAlbums.length);
		console.log("  - Total remote albums:", remoteAlbums.total);
		return false;
	}
};

/** @returns {Promise<import("@types").Album[]>} */
export const getAlbums = async () => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	return tx.store.getAll();
};

/**
 * @param {import("@types").Album['id']} id
 * @returns {Promise<import("@types").Album>}
 */
export const getAlbum = async (id) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	return tx.store.get(id);
};

/**
 * @param {import("@types").Album['id'][]} ids
 * @returns {Promise<import("@types").Album[]>}
 */
export const getAlbumsById = async (ids) => {
	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	return Promise.all([
		...ids.map((id) => tx.store.get(id)),
		tx.done,
	]).then((result) => {
		result.pop();
		return result;
	});
};

/**
 * @param {import("@types").Album['id']} id
 * @returns {Promise<import("@types").Album>}
 */
export const updateAlbumImages = async (id) => {
	const remoteAlbum = await apiCall(`/albums/${id}`);

	const db = await getDatabase();
	const tx = db.transaction("albums", "readwrite");
	const storedAlbum = await tx.store.get(id);
	const updatedAlbum = { ...storedAlbum, images: remoteAlbum.images };
	await tx.store.put(updatedAlbum);
	await tx.done;
	return updatedAlbum;
};
