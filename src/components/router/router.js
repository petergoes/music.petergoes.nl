import { html } from "../../utils/html.js";
import { AppViewHome } from "../view-home/view-home.js";
import { MPGViewAlbums } from "../view-albums/view-albums.js";
import { MPGViewAlbum } from "../view-album/view-album.js";
import { ViewArtist } from "../view-artist/view-artist.js";
import { MPGViewAuth } from "../view-auth/view-auth.js";

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

/** @type {AppViewHome} */
let viewHome;

export class AppRouter extends HTMLElement {
	connectedCallback() {
		this.updateRoute(new URL(location.pathname, location.origin));

		navigation.addEventListener("navigate", (event) => {
			event.intercept();
			const destination = new URL(event.destination.url);
			this.updateRoute(destination);
		});
	}

	/** @param {URL} url */
	updateRoute(url) {
		switch (true) {
			case homePattern.test(url):
				viewHome = viewHome || new AppViewHome();
				this.replaceChildren(viewHome);
				break;

			case albumsPattern.test(url):
				this.innerHTML = html`
					<mpg-view-albums></mpg-view-albums>
				`;
				break;

			case albumPattern.test(url):
				this.replaceChildren(
					new MPGViewAlbum(getId(albumPattern, url)),
				);
				break;

			case artistPattern.test(url):
				this.replaceChildren(
					new ViewArtist(getId(artistPattern, url)),
				);
				break;

			case authPattern.test(url):
			case authCallbackPattern.test(url):
				this.innerHTML = html`
					<mpg-view-auth></mpg-view-auth>
				`;
				break;
		}
	}
}

customElements.define("app-router", AppRouter);
