import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/page-header";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import site from "../data/site.json" with { type: "json" };

export const Route = createFileRoute("/projects")({
	head: () => ({
		meta: [
			{ title: `${site.projects.title} — ${site.hero.name}` },
			{ name: "description", content: site.projects.description },
		],
	}),
	component: Projects,
});

function Projects() {
	const { title, description } = site.projects;

	return (
		<>
			<SiteHeader />
			<main className="page">
				<PageHeader title={title} description={description} />
			</main>
			<SiteFooter />
		</>
	);
}
