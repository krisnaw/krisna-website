import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

export function SiteHeader() {
	const { brand, nav } = site.header;

	return (
		<header className="site-header">
			<div className="frame">
				<nav className="site-nav" aria-label="Primary">
					<a className="brand-mark" href={brand.href}>
						{brand.label}
					</a>
					<div className="nav-links">
						{nav.map((item) => (
							<HoverLink key={item.label} className="nav-link" href={item.href}>
								{item.label}
							</HoverLink>
						))}
						<button className="nav-search" type="button" aria-label="Search">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="m21 21-4.34-4.34" />
								<circle cx="11" cy="11" r="8" />
							</svg>
							<span className="nav-kbd">
								<kbd className="kbd kbd-cmd">⌘</kbd>
								<kbd className="kbd kbd-key">K</kbd>
							</span>
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
}
