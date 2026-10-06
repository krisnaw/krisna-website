import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

function toggleTheme() {
	const next =
		document.documentElement.dataset.theme === "dark" ? "light" : "dark";
	document.documentElement.dataset.theme = next;
	localStorage.setItem("theme", next);
}

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
						<button
							className="nav-theme"
							type="button"
							aria-label="Toggle color theme"
							onClick={toggleTheme}
						>
							<svg
								className="theme-moon"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
							</svg>
							<svg
								className="theme-sun"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<circle cx="12" cy="12" r="4" />
								<path d="M12 2v2" />
								<path d="M12 20v2" />
								<path d="m4.93 4.93 1.41 1.41" />
								<path d="m17.66 17.66 1.41 1.41" />
								<path d="M2 12h2" />
								<path d="M20 12h2" />
								<path d="m6.34 17.66-1.41 1.41" />
								<path d="m19.07 4.93-1.41 1.41" />
							</svg>
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
}
