/**
 * Template literal for syntax highlighting
 *
 * @param {TemplateStringsArray} strings
 * @param  {...unknown} expressions
 * @returns
 */
export const html = (strings, ...expressions) => {
	let index = 0;
	const result = [];
	while (strings.length > index || expressions.length > index) {
		result.push(strings[index] || "");
		result.push(expressions[index] || "");
		index += 1;
	}

	return result
		.join("")
		.split("\n")
		.map((line) => line.trim())
		.join("\n")
		.trim();
};
