import { signal } from "@preact/signals-core";

export const currentUrl = signal(new URL(location.pathname, location.origin));

document.addEventListener("click", (event) => {
	if (event.target instanceof HTMLElement) {
		const link = event.target.closest("a");
		if (link) {
			const targetUrl = new URL(link.href, location.origin);

			if (targetUrl.origin === location.origin) {
				event.preventDefault();
				if (currentUrl.peek().toString() !== targetUrl.toString()) {
					history.pushState({}, "", link.href);
					currentUrl.value = targetUrl;
				}
			}
		}
	}
});

window.addEventListener("popstate", (event) => {
	currentUrl.value = new URL(location.pathname, location.origin);
});
