import { getArtists } from "../data/artists.js";

/**
 * @param {import("@types").Album[]} albums
 * @returns {Promise<import("@types").Album[]>}
 */
export const sortAlbumsByArtist = async (albums) => {
	const artists = await getArtists();

	const map = albums.toSorted((a, b) => a.release_date - b.release_date).reduce(
		/** @param {import("@types").ArtistAlbumMap} map */
		(map, album) => {
			const firstArtist = album.artists[0];
			const artistName = artists.find((artist) => artist.id === firstArtist)
				?.name || "";

			if (!map[artistName]) {
				map[artistName] = [];
			}

			map[artistName].push(album);

			return map;
		},
		{},
	);
	return Object.keys(map).toSorted().map((name) => map[name]).flat();
};
