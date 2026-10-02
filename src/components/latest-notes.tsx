import { Link } from "@tanstack/react-router";
import type { NoteSummary } from "../server/latest-notes";

const dateFormat = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export function LatestNotes({
	notes,
	error,
}: {
	notes: NoteSummary[];
	error: string | null;
}) {
	if (error) {
		return <p className="note-status">{error}</p>;
	}

	if (notes.length === 0) {
		return <p className="note-status">No notes yet.</p>;
	}

	return (
		<ul className="note-list">
			{notes.map((note) => (
				<li key={note.id}>
					<Link
						className="note-row"
						to="/notes/$slug"
						params={{ slug: note.slug }}
					>
						<span>{note.title}</span>
						<time dateTime={note.publishedAt}>
							{dateFormat.format(new Date(note.publishedAt))}
						</time>
					</Link>
				</li>
			))}
		</ul>
	);
}
