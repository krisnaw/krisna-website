import { useRouterState } from "@tanstack/react-router";
import { bind } from "cuelume";
import { useEffect } from "react";
import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

function colorSchemeMeta() {
	return document.querySelector('meta[name="color-scheme"]');
}

function renderedDark() {
	const content = colorSchemeMeta()?.getAttribute("content");
	if (content === "dark") return true;
	if (content === "light") return false;
	return matchMedia("(prefers-color-scheme: dark)").matches;
}

function setScheme(content: "light" | "dark" | "light dark") {
	const meta = colorSchemeMeta();
	if (meta) meta.setAttribute("content", content);
}

function applyScheme(content: "light" | "dark" | "light dark") {
	setScheme(content);
	try {
		if (content === "light dark") {
			localStorage.removeItem("color-scheme");
			localStorage.removeItem("theme");
		} else {
			localStorage.setItem("color-scheme", content);
			localStorage.removeItem("theme");
		}
	} catch {
		// The scheme still applies for this view when storage is blocked.
	}
}

function toggleTheme(button: HTMLButtonElement) {
	const nextDark = !renderedDark();
	const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
	const content =
		nextDark === systemDark ? "light dark" : nextDark ? "dark" : "light";
	const rect = button.getBoundingClientRect();
	const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const root = document.documentElement;

	if (
		reduce ||
		typeof document.startViewTransition !== "function" ||
		rect.width === 0
	) {
		applyScheme(content);
		return;
	}

	const origin = {
		x: rect.left + rect.width / 2,
		y: rect.top + rect.height / 2,
	};
	const radius = Math.hypot(
		Math.max(origin.x, window.innerWidth - origin.x),
		Math.max(origin.y, window.innerHeight - origin.y),
	);

	root.classList.add("theme-switching");
	let transition: ViewTransition;
	try {
		transition = document.startViewTransition(() => applyScheme(content));
	} catch {
		root.classList.remove("theme-switching");
		applyScheme(content);
		return;
	}

	transition.ready
		.then(() => {
			root.animate(
				{
					clipPath: [
						`circle(0px at ${origin.x}px ${origin.y}px)`,
						`circle(${radius}px at ${origin.x}px ${origin.y}px)`,
					],
				},
				{
					duration: 750,
					easing: "cubic-bezier(0.22, 1, 0.36, 1)",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		})
		.catch(() => {});

	transition.finished.finally(() => {
		root.classList.remove("theme-switching");
	});
}

function isCurrent(href: string, pathname: string) {
	if (href.startsWith("http")) return false;
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
	const { brand, nav, showNav } = site.header;
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});

	useEffect(() => {
		bind();
		function onStorage(event: StorageEvent) {
			if (event.key === "color-scheme") {
				setScheme(
					event.newValue === "light" || event.newValue === "dark"
						? event.newValue
						: "light dark",
				);
			} else if (
				event.key === "theme" &&
				(event.newValue === "light" || event.newValue === "dark")
			) {
				setScheme(event.newValue);
			}
		}
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	return (
		<header className="site-header">
			<div className="frame">
				<nav className="site-nav" aria-label="Primary">
					<a className="brand-mark" href={brand.href}>
						{brand.label}
					</a>
					<div className="nav-links">
						{showNav &&
							nav.map((item) => (
								<HoverLink
									key={item.label}
									className="nav-link"
									href={item.href}
									current={isCurrent(item.href, pathname)}
								>
									{item.label}
								</HoverLink>
							))}
						<button
							className="nav-theme"
							type="button"
							data-cuelume-toggle="toggle"
							onClick={(event) => toggleTheme(event.currentTarget)}
						>
							<span className="theme-option theme-to-dark">
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
									<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
								</svg>
								<span className="theme-option-label">Switch to dark theme</span>
							</span>
							<span className="theme-option theme-to-light">
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
								<span className="theme-option-label">
									Switch to light theme
								</span>
							</span>
						</button>
					</div>
				</nav>
			</div>
		</header>
	);
}
