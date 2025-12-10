import { AppViewHome } from "../view-home/view-home.js";
import { ViewAlbums } from "../view-albums/view-albums.js";
import { ViewAlbum } from "../view-album/view-album.js";
import { ViewArtist } from "../view-artist/view-artist.js";
import { ViewAuth } from "../view-auth/view-auth.js";
import { currentUrl } from "../../utils/click-interceptor.js";
import { effect } from "@preact/signals-core";

const homePattern = new URLPattern({ pathname: "/" });
const artistPattern = new URLPattern({ pathname: "/artist/:id" });
const albumsPattern = new URLPattern({ pathname: "/album" });
const albumPattern = new URLPattern({ pathname: "/album/:id" });
const authPattern = new URLPattern({ pathname: "/auth" });
const authCallbackPattern = new URLPattern({ pathname: "/auth/callback" });

/**
 * @param {URLPattern} pattern
 * @param {URL} url
 */
const getId = (pattern, url) => pattern.exec(url)?.pathname?.groups?.id;

export class AppRouter extends HTMLElement {
	connectedCallback() {
		effect(() => {
			this.updateRoute(currentUrl.value);
		});
	}

	/** @param {URL} url */
	updateRoute(url) {
		switch (true) {
			case homePattern.test(url):
				this.replaceChildren(new AppViewHome());
				break;

			case albumsPattern.test(url):
				this.replaceChildren(new ViewAlbums());
				break;

			case albumPattern.test(url):
				this.replaceChildren(new ViewAlbum(getId(albumPattern, url)));
				break;

			case artistPattern.test(url):
				this.replaceChildren(new ViewArtist(getId(artistPattern, url)));
				break;

			case authPattern.test(url):
			case authCallbackPattern.test(url):
				this.replaceChildren(new ViewAuth());
				break;
		}
	}
}

customElements.define("app-router", AppRouter);
