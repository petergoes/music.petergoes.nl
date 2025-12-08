import { Document } from "./src/document.js";
import {
	CSSResponse,
	HTMLResponse,
	JSONResponse,
	JSResponse,
} from "./src/utils/response.js";

/** @param {URL} url */
const loadAsset = (url) => Deno.readTextFile(`${Deno.cwd()}${url.pathname}`);

/** @type {Deno.ServeDefaultExport} */
export default {
	fetch: (request) => {
		const url = new URL(request.url);

		if (request?.url?.endsWith(".css")) {
			return loadAsset(url).then((file) => new CSSResponse(file));
		}

		if (request?.url?.endsWith(".js")) {
			return loadAsset(url).then((file) => new JSResponse(file));
		}

		if (request?.url?.endsWith(".json")) {
			return new Response("not found", { status: 404 });
		}

		return new HTMLResponse(Document());
	},
};
