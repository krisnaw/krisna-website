import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NoteBody } from "../components/note-body";
import { NoteToc, noteHeadings } from "../components/note-toc";
import site from "../data/site.json" with { type: "json" };
import { getNote } from "../server/note";

const dateFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export const Route = createFileRoute("/notes/$slug")({
	loader: async ({ params }) => {
		const result = await getNote({ data: params.slug });
		if (!result.note && !result.error) throw notFound();
		return result;
	},
	head: ({ loaderData }) => ({
		meta: [
			{
				title: loaderData?.note
					? `${loaderData.note.title} — ${site.hero.name}`
					: `${site.notes.title} — ${site.hero.name}`,
			},
			{
				name: "description",
				content: loaderData?.note?.excerpt || site.notes.description,
			},
		],
	}),
	component: NotePage,
	notFoundComponent: NoteUnavailable,
});

function NotePage() {
	const { note, error } = Route.useLoaderData();
	const headings = note ? noteHeadings(note.blocks) : [];

	return (
		<main className="page">
			{error || !note ? (
				<p className="note-status">
					{error ?? "This note could not be loaded."}
				</p>
			) : (
				<article className="note-article">
					<Link to="/notes" className="note-back">
						Notes
					</Link>
					<header>
						<h1>{note.title}</h1>
						<time dateTime={note.publishedAt}>
							{dateFormat.format(new Date(note.publishedAt))}
						</time>
					</header>
					<NoteToc headings={headings} />
					<NoteBody
						blocks={note.blocks}
						headingIds={
							new Map(headings.map((heading) => [heading.key, heading.id]))
						}
					/>
				</article>
			)}
		</main>
	);
}

function NoteUnavailable() {
	return (
		<main className="page">
			<p className="note-status">This note is not available.</p>
		</main>
	);
}
