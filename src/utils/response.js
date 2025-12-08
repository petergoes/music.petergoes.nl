/**
 * @param {string} contentType
 * @param {ResponseInit} [init]
 */
const addContentTypeHeader = (contentType, init) => {
	const headers = new Headers(init?.headers);

	if (headers.get("Content-Type")) {
		headers.delete("Content-Type");
	}

	headers.set("Content-Type", contentType);

	return { ...init, headers };
};

/**
 * A HTTP HTML Response
 * @extends Response
 */
export class HTMLResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("text/html", init);
		super(body, _init);
	}
}

/**
 * A HTTP CSS Response
 * @extends Response
 */
export class CSSResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("text/css", init);
		super(body, _init);
	}
}

/**
 * A HTTP JavaScript Response
 * @extends Response
 */
export class JSResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("text/javascript", init);
		super(body, _init);
	}
}

/**
 * A HTTP JSON Response
 * @extends Response
 */
export class JSONResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("application/json", init);
		super(body, _init);
	}
}

/**
 * A HTTP JSON Response
 * @extends Response
 */
export class SVGResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("image/svg+xml", init);
		super(body, _init);
	}
}
/**
 * A HTTP JSON Response
 * @extends Response
 */
export class PNGResponse extends Response {
	/**
	 * @param {BodyInit} body
	 * @param {ResponseInit} [init]
	 */
	constructor(body, init) {
		const _init = addContentTypeHeader("image/png", init);
		super(body, _init);
	}
}
