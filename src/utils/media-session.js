import { computed, Signal, signal } from "@preact/signals-core";
import { getPlaybackState } from "../data/devices.js";

/** @type {Signal<string | undefined>} */
export const mediaSessionTitle = signal();

/** @type {Signal<string | undefined>} */
export const mediaSessionArtist = signal();

/** @type {Signal<string | undefined>} */
export const mediaSessionAlbum = signal();

/** @type {Signal<string | undefined>} */
export const mediaSessionCover = signal();

/** @type {Signal<MediaMetadataInit | undefined>} */
const mediaSessionMetadata = computed(() => {
	const title = mediaSessionTitle.value;
	const artist = mediaSessionArtist.value;
	const album = mediaSessionAlbum.value;
	const cover = mediaSessionCover.value;

	if (title && artist && album && cover) {
		return {
			title,
			artist,
			album,
			artwork: [
				{
					src: [cover],
				},
			],
		};
	}
});

mediaSessionMetadata.subscribe((init) => {
	if (navigator.mediaSession.metadata?.title !== init?.title) {
		navigator.mediaSession.metadata = new MediaMetadata(init);
	}
});

navigator.mediaSession.setActionHandler("play", () => {
	if (window.webplayer) {
		window.webplayer.resume();
		setTimeout(() => getPlaybackState(), 1000);
	}
});
navigator.mediaSession.setActionHandler("pause", () => {
	if (window.webplayer) {
		window.webplayer.pause();
	}
});

navigator.mediaSession.setActionHandler("previoustrack", () => {
	if (window.webplayer) {
		window.webplayer.previousTrack();
	}
});

navigator.mediaSession.setActionHandler("nexttrack", () => {
	if (window.webplayer) {
		window.webplayer.nextTrack();
	}
});

navigator.mediaSession.setActionHandler("seekto", ({ seekTime }) => {
	if (window.webplayer) {
		window.webplayer.seek(seekTime);
	}
});
