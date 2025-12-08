import { html } from "./utils/html.js";
import deno from "../deno.json" with { type: "json" };

export const styles = import.meta.resolve("./styles.css");
export const script = import.meta.resolve("./scripts.js");

/** @param {string} path */
const cleanAssetPath = (path) => path.replace(/^(.+)(\/src.+)/, "$2");

export const Document = () => {
	return html`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>music.petergoes.nl</title>
				<link rel="stylesheet" href="${cleanAssetPath(styles)}" />
				<script type="importmap">
				${JSON.stringify({ imports: deno.imports }, null, 2)}
				</script>
			</head>

			<body>
				<script src="${cleanAssetPath(script)}" type="module"></script>
			</body>
		</html>
	`;
};
