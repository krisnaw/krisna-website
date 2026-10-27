import { createFileRoute } from "@tanstack/react-router";
import { ContactCard } from "../components/contact-card";
import { DottedLink } from "../components/dotted-link";
import { LatestNotes } from "../components/latest-notes";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import site from "../data/site.json" with { type: "json" };
import { getLatestNotes } from "../server/latest-notes";

export const Route = createFileRoute("/")({
	loader: () => getLatestNotes(),
	component: Home,
});

function Home() {
	const { name, avatar, paragraphs } = site.hero;
	const { notes, error } = Route.useLoaderData();

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
					<section className="home-notes" aria-labelledby="latest-notes">
						<hr className="hero-rule" />
						<div className="home-notes-intro">
							<h2 id="latest-notes">Latest notes</h2>
							<p>{site.notes.description}</p>
						</div>
						<LatestNotes notes={notes} error={error} />
					</section>
					<ContactCard />
				</div>
			</main>
			<SiteFooter />
		</>
	);
}
