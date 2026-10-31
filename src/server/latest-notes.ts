import { createServerFn } from "@tanstack/react-start";
import { emdashGet, isRecord } from "./emdash";
import { excerptFromBlocks, parsePortableText } from "./portable-text";

const POST_LIMIT = 5;
const PAGE_SIZE = 20;
const MAX_PAGES = 5;
const TECHNOLOGY_CATEGORY = "technology";

export type NoteSummary = {
	id: string;
	title: string;
	slug: string;
	publishedAt: string;
	excerpt: string;
};

export type LatestNotesResult = {
	notes: NoteSummary[];
	error: string | null;
};

export const getLatestNotes = createServerFn({ method: "GET" }).handler(
	async (): Promise<LatestNotesResult> => {
		const notes: NoteSummary[] = [];
		let cursor: string | undefined;

		for (let page = 0; page < MAX_PAGES && notes.length < POST_LIMIT; page++) {
			const url = new URLSearchParams({
				status: "published",
				limit: String(PAGE_SIZE),
				orderBy: "publishedAt",
				order: "desc",
			});
			if (cursor) url.set("cursor", cursor);

			const response = await emdashGet(`/_emdash/api/content/posts?${url}`);
			if (response.status !== 200) {
				return { notes: [], error: "Notes could not be loaded." };
			}

			const items = readNotes(response.body);
			const categorized = await Promise.all(
				items.map(async (note) =>
					(await hasTechnologyCategory(note.slug)) ? note : null,
				),
			);
			for (const note of categorized) {
				if (!note) continue;
				notes.push(note);
				if (notes.length >= POST_LIMIT) break;
			}

			cursor = readCursor(response.body);
			if (!cursor || items.length === 0) break;
		}

		return { notes, error: null };
	},
);

async function hasTechnologyCategory(slug: string): Promise<boolean> {
	const response = await emdashGet(
		`/_emdash/api/content/posts/${encodeURIComponent(slug)}/terms/category`,
	);
	if (response.status !== 200 || !isRecord(response.body)) return false;

	const data = isRecord(response.body.data)
		? response.body.data
		: response.body;
	const terms = data.terms;
	if (!Array.isArray(terms)) return false;

	return terms.some((term) => {
		if (!isRecord(term)) return false;
		const slugMatch =
			typeof term.slug === "string" &&
			term.slug.toLowerCase() === TECHNOLOGY_CATEGORY;
		const labelMatch =
			typeof term.label === "string" &&
			term.label.toLowerCase() === TECHNOLOGY_CATEGORY;
		return slugMatch || labelMatch;
	});
}

function readCursor(body: unknown): string | undefined {
	if (!isRecord(body) || !isRecord(body.data)) return undefined;
	return typeof body.data.nextCursor === "string"
		? body.data.nextCursor
		: undefined;
}

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
				excerpt: readExcerpt(item),
			},
		];
	});
}

function readExcerpt(item: Record<string, unknown>): string {
	const fields = publishedFields(item);
	if (!fields) return "";
	if (typeof fields.excerpt === "string" && fields.excerpt.trim()) {
		return fields.excerpt.trim();
	}
	return excerptFromBlocks(parsePortableText(fields.content));
}

function publishedFields(
	item: Record<string, unknown>,
): Record<string, unknown> | null {
	if (isRecord(item.liveData)) return item.liveData;
	if (isRecord(item.data)) return item.data;
	return null;
}
