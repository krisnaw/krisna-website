import { createFileRoute } from "@tanstack/react-router";
import { DottedLink } from "../components/dotted-link";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

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
