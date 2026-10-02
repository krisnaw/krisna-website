import { createFileRoute } from "@tanstack/react-router";
import { DottedLink } from "../components/dotted-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import site from "../data/site.json" with { type: "json" };

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { name, avatar, paragraphs } = site.hero;

	return (
		<>
			<SiteHeader />
			<main className="hero">
				<div className="hero-intro">
					<div className="hero-identity">
						<img src={avatar.src} alt={avatar.alt} width={240} height={240} />
						<h1>{name}</h1>
					</div>
					<div className="hero-copy">
						{paragraphs.map((parts) => (
							<p key={parts.map((part) => part.text).join("")}>
								{parts.map((part) =>
									part.href ? (
										<DottedLink key={part.href} href={part.href}>
											{part.text}
										</DottedLink>
									) : (
										part.text
									),
								)}
							</p>
						))}
					</div>
					<hr className="hero-rule" />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
