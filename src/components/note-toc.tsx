import { useEffect, useState } from "react";
import type { NoteBlock } from "../server/portable-text";

export type NoteHeading = {
	key: string;
	id: string;
	text: string;
	level: 2 | 3 | 4;
};

type TocItem = NoteHeading & { children: TocItem[] };

export function noteHeadings(blocks: NoteBlock[]): NoteHeading[] {
	const used = new Map<string, number>();
	const headings: NoteHeading[] = [];

	for (const block of blocks) {
		if (block.kind !== "text" || block.listItem) continue;
		if (block.style !== "h2" && block.style !== "h3" && block.style !== "h4")
			continue;

		const text = block.spans
			.map((span) => span.text)
			.join("")
			.replace(/\s+/g, " ")
			.trim();
		if (!text) continue;

		const base = slugify(text);
		const count = used.get(base) ?? 0;
		used.set(base, count + 1);

		headings.push({
			key: block.key,
			id: count === 0 ? base : `${base}-${count + 1}`,
			text,
			level: block.style === "h2" ? 2 : block.style === "h3" ? 3 : 4,
		});
	}

	return headings;
}

export function NoteToc({ headings }: { headings: NoteHeading[] }) {
	const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
	const items = tocTree(headings);
	const activeSection = sectionId(headings, activeId);

	useEffect(() => {
		const nodes = headings
			.map((heading) => document.getElementById(heading.id))
			.filter((node): node is HTMLElement => node !== null);
		if (nodes.length === 0) return;

		const markCurrent = () => {
			const line = Math.min(160, window.innerHeight * 0.28);
			let current = nodes[0].id;
			for (const node of nodes) {
				if (node.getBoundingClientRect().top <= line) current = node.id;
			}
			const atEnd =
				window.scrollY + window.innerHeight >=
				document.documentElement.scrollHeight - 2;
			if (atEnd) {
				const visible = nodes.filter((node) => {
					const top = node.getBoundingClientRect().top;
					return top < window.innerHeight && top + node.offsetHeight > 0;
				});
				if (visible.length > 0) current = visible[visible.length - 1].id;
			}
			setActiveId(current);
		};

		markCurrent();
		window.addEventListener("scroll", markCurrent, { passive: true });
		return () => window.removeEventListener("scroll", markCurrent);
	}, [headings]);

	if (headings.length < 2) return null;

	return (
		<div className="note-toc">
			<div className="note-toc-dashes" aria-hidden="true">
				{items.map((item) => (
					<span
						key={item.id}
						className={item.id === activeSection ? "is-active" : undefined}
					/>
				))}
			</div>
			<nav aria-label="Table of contents">
				<TocList items={items} activeId={activeId} onSelect={setActiveId} />
			</nav>
		</div>
	);
}

function TocList({
	items,
	activeId,
	onSelect,
}: {
	items: TocItem[];
	activeId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<ol>
			{items.map((item) => (
				<li key={item.id}>
					<a
						href={`#${item.id}`}
						data-level={item.level}
						aria-current={item.id === activeId ? "location" : undefined}
						onClick={(event) => {
							const target = document.getElementById(item.id);
							if (!target) return;
							event.preventDefault();
							target.scrollIntoView({ block: "start" });
							history.pushState(null, "", `#${item.id}`);
							onSelect(item.id);
						}}
					>
						{item.text}
					</a>
					{item.children.length > 0 ? (
						<TocList
							items={item.children}
							activeId={activeId}
							onSelect={onSelect}
						/>
					) : null}
				</li>
			))}
		</ol>
	);
}

function tocTree(headings: NoteHeading[]): TocItem[] {
	const root: TocItem[] = [];
	const stack: TocItem[] = [];

	for (const heading of headings) {
		const item: TocItem = { ...heading, children: [] };
		while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
			stack.pop();
		}
		const parent = stack[stack.length - 1];
		if (parent) parent.children.push(item);
		else root.push(item);
		stack.push(item);
	}

	return root;
}

function sectionId(headings: NoteHeading[], activeId: string) {
	let section = headings[0]?.id ?? "";
	for (const heading of headings) {
		if (heading.level === 2) section = heading.id;
		if (heading.id === activeId) return section;
	}
	return section;
}

function slugify(text: string): string {
	const slug = text
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return slug || "section";
}
