import {
	CSSResponse,
	HTMLResponse,
	JSONResponse,
	JSResponse,
	PNGResponse,
	SVGResponse,
} from "./src/utils/response.js";

const document = Deno.readTextFileSync("./index.html");

/** @param {URL} url */
const loadAsset = (url) => Deno.readTextFile(`${Deno.cwd()}${url.pathname}`);
const loadPngAsset = (url) => Deno.readFile(`${Deno.cwd()}${url.pathname}`);

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

		if (request?.url?.endsWith(".webmanifest")) {
			return loadAsset(url).then((file) => new JSONResponse(file));
		}

		if (request?.url?.endsWith(".svg")) {
			return loadAsset(url).then((file) => new SVGResponse(file));
		}

		if (request?.url?.endsWith(".png")) {
			return loadPngAsset(url).then((file) => new PNGResponse(file));
		}

		if (request?.url?.endsWith(".json")) {
			return new Response("not found", { status: 404 });
		}

		return new HTMLResponse(document);
	},
};
