import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "../components/page-header";
import site from "../data/site.json" with { type: "json" };

export const Route = createFileRoute("/projects/")({
	head: () => ({
		meta: [
			{ title: `${site.projects.title} — ${site.hero.name}` },
			{ name: "description", content: site.projects.description },
		],
	}),
	component: ProjectsIndex,
});

function ProjectsIndex() {
	const { title, description, items } = site.projects;

	return (
		<main className="page">
			<PageHeader title={title} description={description} />
			<ul className="note-list">
				{items.map((item) => (
					<li key={item.slug}>
						<Link
							className="note-row"
							to="/projects/$slug"
							params={{ slug: item.slug }}
						>
							<span>{item.name}</span>
							<time>{item.year}</time>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
