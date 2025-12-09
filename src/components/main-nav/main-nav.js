import { html } from "../../utils/html.js";

export class MainNav extends HTMLElement {
	connectedCallback() {
		this.innerHTML = html`
			<h2>navigation</h2>
			<nav>
				<ul>
					<li><a href="/">home</a></li>
					<li><a href="/albums">albums</a></li>
					<li><a href="/auth">auth</a></li>
				</ul>
			</nav>
		`;
	}
}

customElements.define("main-nav", MainNav);
