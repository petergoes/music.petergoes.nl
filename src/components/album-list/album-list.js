import { effect, signal } from "@preact/signals-core";
import { getAlbum, getAlbums } from "../../data/albums.js";
import { AlbumListItem } from "../album-list-item/album-list-item.js";

import styles from "./album-list.css" with { type: "css" };
import { toArtistAlbumMap } from "../../utils/to-artist-album-map.js";
document.adoptedStyleSheets.push(styles);

export class AlbumList extends HTMLElement {
	/** @type {Signal<boolean>} */
	#gPressedBefore;

	/** @param {import("@types").Album[] | import("@types").Album['id'][]} [albums] */
	constructor(albums) {
		super();
		this.role = "list";
		this.tabIndex = 0;

		this.#gPressedBefore = signal(false);

		effect(() => {
			if (this.#gPressedBefore.value) {
				setTimeout(() => {
					this.#gPressedBefore.value = false;
				}, 500);
			}
		});

		Promise.resolve(() => albums ? albums : getAlbums())
			.then(async (getter) => {
				const albums = await getter();
				return Promise.all(
					albums.map(async (album) =>
						typeof album === "string" ? await getAlbum(album) : album
					),
				);
			})
			.then(async (albums) => {
				return (await toArtistAlbumMap(albums)).forEach(
					(album) => {
						this.appendChild(new AlbumListItem(album));
					},
				);
			});
	}

	connectedCallback() {
		this.addEventListener("keydown", this.handleKeyDown);
		setTimeout(() => {
			this.focusFirst();
		}, 100);
	}

	/** @param {KeyboardEvent} event */
	handleKeyDown = (event) => {
		switch (event.key) {
			case "j":
				return this.focusDown(event);
			case "k":
				return this.focusUp(event);
			case "h":
				return this.focusLeft(event);
			case "l":
				return this.focusRight(event);
			case "g":
				if (this.#gPressedBefore.peek()) {
					this.#gPressedBefore.value = false;
					this.focusFirst();
				} else {
					this.#gPressedBefore.value = true;
				}
				return;
			case "e":
				if (this.#gPressedBefore.peek()) {
					this.#gPressedBefore.value = false;
					this.focusLast();
				}
				return;
		}
	};

	/** @param {KeyboardEvent} event */
	focusDown = (event) => {
		const target = event.target;
		if (target === this) {
			this.children.item(0)?.focus();
			return;
		}

		const listItem = event.target.closest("album-list-item");
		if (listItem) {
			const index = [...this.children].indexOf(listItem);
			const itemsPerRow = this.calculateItemsPerRow(listItem);
			const nextRowIndex = index + itemsPerRow;

			if (nextRowIndex > this.children.length) return;

			this.childNodes.item(nextRowIndex)?.focus();
		}
	};

	/** @param {KeyboardEvent} event */
	focusUp = (event) => {
		const listItem = event.target.closest("album-list-item");
		if (listItem) {
			const index = [...this.children].indexOf(listItem);
			const itemsPerRow = this.calculateItemsPerRow(listItem);
			const nextRowIndex = index - itemsPerRow;

			if (nextRowIndex < 0) return;

			this.childNodes.item(nextRowIndex)?.focus();
		}
	};

	/** @param {KeyboardEvent} event */
	focusLeft = (event) => {
		const listItem = event.target.closest("album-list-item");
		if (listItem) {
			const index = [...this.children].indexOf(listItem);
			const itemsPerRow = this.calculateItemsPerRow(listItem);
			const positionInRow = index % itemsPerRow;
			const prevIndexInRow = index - 1;

			if (positionInRow === 0) return;

			this.childNodes.item(prevIndexInRow)?.focus();
		}
	};

	/** @param {KeyboardEvent} event */
	focusRight = (event) => {
		const listItem = event.target.closest("album-list-item");
		if (listItem) {
			const index = [...this.children].indexOf(listItem);
			const itemsPerRow = this.calculateItemsPerRow(listItem);
			const positionInRow = index % itemsPerRow;
			const nextIndexInRow = index + 1;

			if (positionInRow === itemsPerRow - 1) return;

			this.childNodes.item(nextIndexInRow)?.focus();
		}
	};

	focusFirst() {
		this.querySelector(":first-child")?.focus();
	}

	focusLast() {
		this.querySelector("album-list-item:last-of-type")?.focus();
	}

	/** @param {AlbumListItem} listItem */
	calculateItemsPerRow = (listItem) => {
		const listItemBoundingRect = listItem.getBoundingClientRect();
		const parentBoundingRect = this.getBoundingClientRect();
		const itemsPerRow = Math.round(
			parentBoundingRect.width / listItemBoundingRect.width,
		);
		return itemsPerRow;
	};
}

customElements.define("album-list", AlbumList);
