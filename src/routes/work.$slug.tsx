import { createFileRoute, notFound } from "@tanstack/react-router";
import {
	ProjectSheet,
	type ProjectSheetItem,
} from "../components/project-sheet";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import site from "../data/site.json" with { type: "json" };
import work from "../data/work.json" with { type: "json" };

export const Route = createFileRoute("/work/$slug")({
	loader: ({ params }) => {
		const item = (work.items as ProjectSheetItem[]).find(
			(entry) => entry.slug === params.slug,
		);
		if (!item) throw notFound();
		return { work: item };
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData
					? `${loaderData.work.name} — ${site.hero.name}`
					: `Work — ${site.hero.name}`,
			},
			{
				name: "description",
				content:
					loaderData?.work.sections[0]?.body ?? site.projects.description,
			},
		],
	}),
	component: WorkPage,
	notFoundComponent: WorkUnavailable,
});

function WorkPage() {
	const { work } = Route.useLoaderData();

	return (
		<>
			<SiteHeader />
			<main>
				<ProjectSheet work={work} />
			</main>
			<SiteFooter />
		</>
	);
}

function WorkUnavailable() {
	return (
		<>
			<SiteHeader />
			<main className="page">
				<p className="note-status">This project is not available.</p>
			</main>
			<SiteFooter />
		</>
	);
}
