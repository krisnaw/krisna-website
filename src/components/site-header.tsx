import { HoverLink } from "./dotted-link";

const NAV = [
	{ href: "https://saivamshi.aethoscompany.in/projects", label: "WORK" },
	{ href: "https://saivamshi.aethoscompany.in/notes", label: "NOTES" },
	{ href: "https://saivamshi.aethoscompany.in/favorites", label: "FAV" },
	{ href: "https://saivamshi.aethoscompany.in/cv", label: "CV" },
] as const;

export function SiteHeader() {
	return (
		<header className="site-header">
			<div className="frame">
				<nav className="site-nav" aria-label="Primary">
					<a className="brand-mark" href="/">
						SV
					</a>
					<div className="nav-links">
						{NAV.map((item) => (
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
