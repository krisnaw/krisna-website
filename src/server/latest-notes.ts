import { createServerFn } from "@tanstack/react-start";
import { emdashGet, isRecord } from "./emdash";

const POST_LIMIT = 5;

export type NoteSummary = {
	id: string;
	title: string;
	slug: string;
	publishedAt: string;
};

export type LatestNotesResult = {
	notes: NoteSummary[];
	error: string | null;
};

export const getLatestNotes = createServerFn({ method: "GET" }).handler(
	async (): Promise<LatestNotesResult> => {
		const url = new URLSearchParams({
			status: "published",
			limit: String(POST_LIMIT),
			orderBy: "publishedAt",
			order: "desc",
		});
		const response = await emdashGet(`/_emdash/api/content/posts?${url}`);

		if (response.status !== 200) {
			return { notes: [], error: "Notes could not be loaded." };
		}

		return { notes: readNotes(response.body), error: null };
	},
);

function readNotes(body: unknown): NoteSummary[] {
	if (!isRecord(body) || body.success !== true || !isRecord(body.data)) {
		return [];
	}

	const items = body.data.items;
	if (!Array.isArray(items)) return [];

	return items.flatMap((item) => {
		if (!isRecord(item) || !isRecord(item.data)) return [];
		const id = item.id;
		const slug = item.slug;
		const title = item.data.title;
		const publishedAt = item.publishedAt;
		if (
			typeof id !== "string" ||
			typeof slug !== "string" ||
			typeof title !== "string" ||
			typeof publishedAt !== "string"
		) {
			return [];
		}

		return [
			{
				id,
				title,
				slug,
				publishedAt,
			},
		];
	});
}
