import { createServerFn } from "@tanstack/react-start";
import { emdashGet, isRecord } from "./emdash";
import {
	excerptFromBlocks,
	type NoteBlock,
	parsePortableText,
} from "./portable-text";

export type Note = {
	slug: string;
	title: string;
	publishedAt: string;
	excerpt: string;
	blocks: NoteBlock[];
};

export type NoteResult = {
	note: Note | null;
	error: string | null;
};

const slugPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,199}$/;

export const getNote = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }): Promise<NoteResult> => {
		if (!slugPattern.test(slug)) {
			return { note: null, error: null };
		}

		const response = await emdashGet(
			`/_emdash/api/content/posts/${encodeURIComponent(slug)}`,
		);
		if (
			response.status === 0 ||
			(response.status !== 200 && response.status !== 404)
		) {
			return { note: null, error: "This note could not be loaded." };
		}
		if (response.status === 404) {
			return { note: null, error: null };
		}

		return { note: readNote(response.body), error: null };
	});

function readNote(body: unknown): Note | null {
	if (
		!isRecord(body) ||
		body.success !== true ||
		!isRecord(body.data) ||
		!isRecord(body.data.item)
	) {
		return null;
	}

	const item = body.data.item;
	if (
		item.status !== "published" ||
		typeof item.slug !== "string" ||
		typeof item.publishedAt !== "string"
	) {
		return null;
	}

	const fields = publishedFields(item);
	if (!fields || typeof fields.title !== "string") return null;

	const blocks = parsePortableText(fields.content);
	return {
		slug: item.slug,
		title: fields.title,
		publishedAt: item.publishedAt,
		excerpt: excerptFromBlocks(blocks),
		blocks,
	};
}

function publishedFields(
	item: Record<string, unknown>,
): Record<string, unknown> | null {
	if (isRecord(item.liveData) && typeof item.liveData.title === "string")
		return item.liveData;
	if (isRecord(item.data) && typeof item.data.title === "string")
		return item.data;
	return null;
}
