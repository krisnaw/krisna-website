import { createFileRoute } from "@tanstack/react-router";
import { LatestNotes } from "../components/latest-notes";
import { PageHeader } from "../components/page-header";
import site from "../data/site.json" with { type: "json" };
import { getLatestNotes } from "../server/latest-notes";

export const Route = createFileRoute("/notes/")({
	head: () => ({
		meta: [
			{ title: `${site.notes.title} — ${site.hero.name}` },
			{ name: "description", content: site.notes.description },
		],
	}),
	loader: () => getLatestNotes(),
	component: NotesIndex,
});

function NotesIndex() {
	const { title, description } = site.notes;
	const { notes, error } = Route.useLoaderData();

	return (
		<main className="page">
			<PageHeader title={title} description={description} />
			<LatestNotes notes={notes} error={error} />
		</main>
	);
}
