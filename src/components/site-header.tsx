import { useRouterState } from "@tanstack/react-router";
import { bind } from "cuelume";
import { useEffect } from "react";
import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

function themePressed() {
	return document.documentElement.dataset.theme === "dark" ? "true" : "false";
}

function syncThemePressed(button: HTMLButtonElement | null) {
	if (!button || typeof document === "undefined") return;
	button.setAttribute("aria-pressed", themePressed());
}

function applyTheme(button: HTMLButtonElement, next: "light" | "dark") {
	document.documentElement.dataset.theme = next;
	localStorage.setItem("theme", next);
	button.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
}

function toggleTheme(button: HTMLButtonElement) {
	const next =
		document.documentElement.dataset.theme === "dark" ? "light" : "dark";
	const rect = button.getBoundingClientRect();
	const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
	const root = document.documentElement;

	if (
		reduce ||
		typeof document.startViewTransition !== "function" ||
		rect.width === 0
	) {
		applyTheme(button, next);
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
		transition = document.startViewTransition(() => applyTheme(button, next));
	} catch {
		root.classList.remove("theme-switching");
		applyTheme(button, next);
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

	useEffect(() => bind(), []);

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
							ref={syncThemePressed}
							className="nav-theme"
							type="button"
							aria-label="Toggle color theme"
							data-cuelume-toggle="toggle"
							onClick={(event) => toggleTheme(event.currentTarget)}
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
