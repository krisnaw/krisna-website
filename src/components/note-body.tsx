import type { ReactNode } from "react";
import type {
	NoteBlock,
	NoteSpan,
	NoteTextBlock,
} from "../server/portable-text";

export function NoteBody({
	blocks,
	headingIds,
}: {
	blocks: NoteBlock[];
	headingIds: Map<string, string>;
}) {
	return <div className="note-body">{renderBlocks(blocks, headingIds)}</div>;
}

function renderBlocks(
	blocks: NoteBlock[],
	headingIds: Map<string, string>,
): ReactNode[] {
	const nodes: ReactNode[] = [];
	let index = 0;

	while (index < blocks.length) {
		const block = blocks[index];
		if (block.kind === "text" && block.listItem) {
			const [node, next] = takeList(blocks, index, block.level, headingIds);
			nodes.push(node);
			index = next;
			continue;
		}

		nodes.push(renderBlock(block, headingIds.get(block.key)));
		index += 1;
	}

	return nodes;
}

function takeList(
	blocks: NoteBlock[],
	start: number,
	level: number,
	headingIds: Map<string, string>,
): [ReactNode, number] {
	const first = blocks[start];
	if (first.kind !== "text" || !first.listItem) {
		return [null, start + 1];
	}

	const listItem = first.listItem;
	const items: ReactNode[] = [];
	let index = start;

	while (index < blocks.length) {
		const block = blocks[index];
		if (
			block.kind !== "text" ||
			block.listItem !== listItem ||
			block.level !== level
		)
			break;

		index += 1;
		const children: ReactNode[] = [];
		while (index < blocks.length) {
			const nested = blocks[index];
			if (nested.kind !== "text" || !nested.listItem || nested.level <= level)
				break;
			const [child, next] = takeList(blocks, index, nested.level, headingIds);
			children.push(child);
			index = next;
		}

		items.push(
			<li key={block.key}>
				<Spans spans={block.spans} />
				{children}
			</li>,
		);
	}

	const List = listItem === "number" ? "ol" : "ul";
	return [<List key={`${listItem}-${first.key}`}>{items}</List>, index];
}

function renderBlock(block: NoteBlock, id?: string) {
	if (block.kind === "image") {
		return (
			<figure key={block.key}>
				<img src={block.src} alt={block.alt} />
				{block.caption ? <figcaption>{block.caption}</figcaption> : null}
			</figure>
		);
	}

	if (block.kind === "code") {
		return (
			<pre key={block.key}>
				<code>{block.code}</code>
			</pre>
		);
	}

	return renderText(block, id);
}

function renderText(block: NoteTextBlock, id?: string) {
	const content = <Spans spans={block.spans} />;

	if (block.style === "h2")
		return (
			<h2 id={id} key={block.key}>
				{content}
			</h2>
		);
	if (block.style === "h3")
		return (
			<h3 id={id} key={block.key}>
				{content}
			</h3>
		);
	if (block.style === "h4")
		return (
			<h4 id={id} key={block.key}>
				{content}
			</h4>
		);
	if (block.style === "blockquote")
		return <blockquote key={block.key}>{content}</blockquote>;
	return <p key={block.key}>{content}</p>;
}

function Spans({ spans }: { spans: NoteSpan[] }) {
	return spans.map((span) => {
		let node: ReactNode = span.text;
		if (span.code) node = <code>{node}</code>;
		if (span.strong) node = <strong>{node}</strong>;
		if (span.em) node = <em>{node}</em>;
		if (span.href) {
			const external = span.href.startsWith("http");
			node = (
				<a
					href={span.href}
					{...(external
						? { target: "_blank", rel: "noopener noreferrer" }
						: {})}
				>
					{node}
				</a>
			);
		}

		return <span key={span.key}>{node}</span>;
	});
}
