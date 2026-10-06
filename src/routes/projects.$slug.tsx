import { createFileRoute, notFound } from "@tanstack/react-router";
import { CaseStudy, type WorkItem } from "../components/case-study";
import site from "../data/site.json" with { type: "json" };

export const Route = createFileRoute("/projects/$slug")({
	loader: ({ params }) => {
		const work = (site.projects.items as WorkItem[]).find(
			(item) => item.slug === params.slug,
		);
		if (!work) throw notFound();
		return { work };
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.work.title} — ${site.hero.name}`
					: `${site.projects.title} — ${site.hero.name}`,
			},
			{
				name: "description",
				content: loaderData?.work.intro[0] ?? site.projects.description,
			},
		],
	}),
	component: ProjectPage,
	notFoundComponent: ProjectUnavailable,
});

function ProjectPage() {
	const { work } = Route.useLoaderData();

	return (
		<main>
			<CaseStudy work={work} />
		</main>
	);
}

function ProjectUnavailable() {
	return (
		<main className="page">
			<p className="note-status">This project is not available.</p>
		</main>
	);
}
