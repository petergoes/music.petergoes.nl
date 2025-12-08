import { apiCall } from "../spotify/api-call.js";
import { addAlbums, addTracks, getAlbums as getAlbumsFromDB } from "./idb.js";

const fetchAlbumsRemote = () =>
	apiCall("/me/albums").then(async (data) => {
		const albumPromises = data.items.map(async (item) => {
			const { tracks, ...album } = item.album;
			await addTracks(tracks.items);
			const albumObj = {
				added_at: item.added_at,
				...album,
				tracks: tracks.items.map((track) => track.id),
			};
			return albumObj;
		});
		const albums = await Promise.all(albumPromises);
		// localStorage.setItem("albums", JSON.stringify(albums));
		return storeAlbums(albums);
	});

/** @returns {Promise<import('@types').Album[]>} */
export const getAlbums = async () => {
	// const storedAlbums = await getAlbumsFromDB();

	// if (!storedAlbums) {
	// 	console.log("no stored albums");
	// 	// return fetchAlbumsRemote();
	// }

	// return storedAlbums;
};

/**
 * @param {string} uri
 * @returns {Promise<import('@types').Album>}
 */
export const getAlbum = async (uri) => {
	// const albums = await getAlbums();
	// const album = albums.find((album) => album.uri === uri);
	// if (!album) throw new Error("album not found");
	// return album;
};
