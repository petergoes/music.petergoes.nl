import { signal } from "@preact/signals-core";

export const documentIsVisible = signal(!document.hidden);

document.addEventListener("visibilitychange", () => {
	documentIsVisible.value = !document.hidden;
});
