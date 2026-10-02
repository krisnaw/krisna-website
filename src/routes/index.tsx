import { createFileRoute } from "@tanstack/react-router";
import { useId } from "react";

const NAV = [
	{ href: "https://saivamshi.aethoscompany.in/projects", label: "WORK" },
	{ href: "https://saivamshi.aethoscompany.in/notes", label: "NOTES" },
	{ href: "https://saivamshi.aethoscompany.in/favorites", label: "FAV" },
	{ href: "https://saivamshi.aethoscompany.in/cv", label: "CV" },
] as const;

const SPRITES = [
	["🌵", "hyderabad heat", "0ms"],
	["🌸", "touch grass", "70ms"],
	["👾", "ship it", "140ms"],
	["🪴", "slow growth", "210ms"],
	["✳️", "hand-built", "280ms"],
] as const;

const SOCIAL = [
	["X", "https://x.com/urstruelysv"],
	["Instagram", "https://www.instagram.com/urstruelysv/"],
	["GitHub", "https://github.com/urstruelysv"],
	["LinkedIn", "https://www.linkedin.com/in/sai-vamshi-375997194"],
	["Peerlist", "https://peerlist.io/urstruelysv"],
	["Medium", "https://medium.com/@urstruelysv"],
	["Email", "mailto:saivamshig404@gmail.com"],
] as const;

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<SiteHeader />
			<main className="hero">
				<div className="hero-intro">
					<div className="hero-identity">
						<img
							src="/avatar.png"
							alt="Sai Vamshi Gannoju"
							width={240}
							height={240}
						/>
						<h1>Sai Vamshi Gannoju</h1>
					</div>
					<div className="hero-copy">
						<p>
							Full-stack engineer with 5+ years of experience across freelance
							work, contract SaaS, and founding my own.
						</p>
						<p>
							I ship Next.js products end to end, from the first sketch to the
							thing running in production: UI, APIs, AI integrations, and the
							systems underneath them.
						</p>
						<p>
							Currently building{" "}
							<DottedLink href="https://www.aethoscompany.in/">
								Aethos Labs
							</DottedLink>
							, <DottedLink href="https://cirrowtr.in">Cirro</DottedLink>, and
							other cool things.
						</p>
						<p>
							On the side I build small tools for the parts of my own workflow
							that annoy me. Those live on the{" "}
							<DottedLink href="https://saivamshi.aethoscompany.in/projects">
								projects
							</DottedLink>{" "}
							page.
						</p>
						<p>
							Based in Hyderabad, India, working remote with teams across time
							zones. When I'm not shipping, I'm usually writing about what broke
							and what I'd do differently.
						</p>
						<p>
							Here is my{" "}
							<DottedLink href="https://saivamshi.aethoscompany.in/cv">
								CV
							</DottedLink>
							.
						</p>
					</div>
					<hr className="hero-rule" />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}

function SiteHeader() {
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

function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="frame">
				<hr className="hero-rule footer-rule" />
			</div>
			<div className="frame footer-body">
				<div className="sprite-row">
					{SPRITES.map(([emoji, label, delay]) => (
						<span key={label} className="sprite-item">
							<span className="sprite" style={{ animationDelay: delay }}>
								<span className="sprite-emoji" role="img" aria-label={label}>
									{emoji}
								</span>
							</span>
							<span className="sprite-tip" aria-hidden="true">
								{label}
							</span>
						</span>
					))}
				</div>
				<div className="social-row">
					{SOCIAL.map(([label, href]) => (
						<HoverLink key={label} className="social-link" href={href}>
							{label}
						</HoverLink>
					))}
				</div>
				<p className="footer-meta">Last updated September 2026</p>
				<p className="footer-meta">© Sai Vamshi Gannoju.</p>
			</div>
		</footer>
	);
}

function HoverLink({
	href,
	className,
	children,
}: {
	href: string;
	className: string;
	children: string;
}) {
	const rawId = useId();
	const id = `dots-${rawId.replace(/:/g, "")}`;
	const external = href.startsWith("http");

	return (
		<a
			className={className}
			href={href}
			{...(external
				? { target: "_blank", rel: "noopener noreferrer" }
				: { rel: "noopener noreferrer" })}
		>
			<span className="dotted-link-text">
				{children}
				<DotRule id={id} />
			</span>
		</a>
	);
}

function DottedLink({ href, children }: { href: string; children: string }) {
	const rawId = useId();
	const id = `dots-${rawId.replace(/:/g, "")}`;

	return (
		<a
			className="dotted-link"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			<span className="dotted-link-text">
				{children}
				<DotRule id={id} />
			</span>
		</a>
	);
}

function DotRule({ id = "hero-rule-dots" }: { id?: string }) {
	return (
		<svg className="dot-rule" aria-hidden="true" preserveAspectRatio="none">
			<defs>
				<pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
					<circle cx="3" cy="2" r="1" fill="currentColor" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
		</svg>
	);
}
