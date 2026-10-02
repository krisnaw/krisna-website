import { BLOG_ORIGIN, isRecord } from "./emdash";

export type NoteSpan = {
	key: string;
	text: string;
	strong: boolean;
	em: boolean;
	code: boolean;
	href: string | null;
};

export type NoteTextBlock = {
	kind: "text";
	key: string;
	style: "paragraph" | "h2" | "h3" | "h4" | "blockquote";
	listItem: "bullet" | "number" | null;
	level: number;
	spans: NoteSpan[];
};

export type NoteImageBlock = {
	kind: "image";
	key: string;
	src: string;
	alt: string;
	caption: string | null;
};

export type NoteCodeBlock = {
	kind: "code";
	key: string;
	language: string | null;
	code: string;
};

export type NoteBlock = NoteTextBlock | NoteImageBlock | NoteCodeBlock;

const textStyles = {
	normal: "paragraph",
	blockquote: "blockquote",
	h1: "h2",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h4",
	h6: "h4",
} as const;

export function parsePortableText(content: unknown): NoteBlock[] {
	if (!Array.isArray(content)) return [];
	return content.flatMap((block, index) => readBlock(block, index));
}

export function excerptFromBlocks(blocks: NoteBlock[]): string {
	const text = blocks
		.flatMap((block) =>
			block.kind === "text" ? block.spans.map((span) => span.text) : [],
		)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();

	if (text.length <= 160) return text;
	return `${text.slice(0, 157).trimEnd()}…`;
}

function readBlock(block: unknown, index: number): NoteBlock[] {
	if (!isRecord(block)) return [];
	const key = typeof block._key === "string" ? block._key : `block-${index}`;

	if (block._type === "image") {
		const image = readImage(block, key);
		return image ? [image] : [];
	}

	if (block._type === "gallery" && Array.isArray(block.images)) {
		return block.images.flatMap((image, imageIndex) => {
			if (!isRecord(image)) return [];
			const child = readImage(image, `${key}-${imageIndex}`);
			return child ? [child] : [];
		});
	}

	if (block._type === "code") {
		const code = readCode(block, key);
		return code ? [code] : [];
	}

	if (block._type !== "block") return [];

	const style =
		textStyles[block.style as keyof typeof textStyles] ?? "paragraph";
	const spans = readSpans(block);
	if (spans.every((span) => span.text.length === 0)) return [];

	const listItem =
		block.listItem === "bullet" || block.listItem === "number"
			? block.listItem
			: null;
	const level =
		typeof block.level === "number" && block.level > 0 ? block.level : 1;

	return [
		{
			kind: "text",
			key,
			style,
			listItem,
			level,
			spans,
		},
	];
}

function readSpans(block: Record<string, unknown>): NoteSpan[] {
	if (!Array.isArray(block.children)) return [];
	const links = new Map<string, string>();

	if (Array.isArray(block.markDefs)) {
		for (const mark of block.markDefs) {
			if (
				!isRecord(mark) ||
				mark._type !== "link" ||
				typeof mark._key !== "string"
			)
				continue;
			const href = safeHref(mark.href);
			if (href) links.set(mark._key, href);
		}
	}

	return block.children.flatMap((child, index) => {
		if (!isRecord(child) || typeof child.text !== "string") return [];
		const marks = Array.isArray(child.marks)
			? child.marks.filter((mark) => typeof mark === "string")
			: [];
		const href =
			marks
				.map((mark) => links.get(mark))
				.find((value) => value !== undefined) ?? null;

		return [
			{
				key: typeof child._key === "string" ? child._key : `span-${index}`,
				text: child.text,
				strong: marks.includes("strong"),
				em: marks.includes("em"),
				code: marks.includes("code"),
				href,
			},
		];
	});
}

function readImage(
	block: Record<string, unknown>,
	key: string,
): NoteImageBlock | null {
	const src =
		mediaUrl(block.url) ??
		mediaUrl(block.src) ??
		mediaUrl(isRecord(block.asset) ? block.asset.url : null);
	if (!src) return null;

	return {
		kind: "image",
		key,
		src,
		alt: typeof block.alt === "string" ? block.alt : "",
		caption:
			typeof block.caption === "string" && block.caption.trim()
				? block.caption
				: null,
	};
}

function readCode(
	block: Record<string, unknown>,
	key: string,
): NoteCodeBlock | null {
	const language = typeof block.language === "string" ? block.language : null;
	const code =
		typeof block.code === "string"
			? block.code
			: typeof block.value === "string"
				? block.value
				: readSpans(block)
						.map((span) => span.text)
						.join("");

	if (!code) return null;
	return { kind: "code", key, language, code };
}

function mediaUrl(value: unknown): string | null {
	if (typeof value !== "string" || value.length === 0) return null;
	if (value.startsWith("/") && !value.startsWith("//"))
		return `${BLOG_ORIGIN}${value}`;
	return safeHref(value);
}

function safeHref(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const href = value.trim();
	if (href.startsWith("/") && !href.startsWith("//")) return href;
	if (
		href.startsWith("mailto:") &&
		href.length > "mailto:".length &&
		!/\s/.test(href)
	) {
		return href;
	}

	try {
		const url = new URL(href);
		if (url.protocol === "https:" || url.protocol === "http:") return url.href;
	} catch {
		return null;
	}

	return null;
}
