export type WorkItem = {
	slug: string;
	name: string;
	year: string;
	eyebrow: string;
	title: string;
	timeline: { when: string; phase: string }[];
	role: string[];
	intro: string[];
	site: { label: string; href: string };
	blocks: WorkBlock[];
};

type FigureBlock = { kind: "figure"; label: string; caption: string };
type SectionBlock = {
	kind: "section";
	title: string;
	paragraphs: string[];
	quote?: string;
};
type PointsBlock = {
	kind: "points";
	title: string;
	intro: string;
	items: { title: string; body: string }[];
};
type StatsBlock = {
	kind: "stats";
	title: string;
	items: { value: string; body: string }[];
};
type ClosingBlock = { kind: "closing"; text: string };
type WorkBlock =
	| FigureBlock
	| SectionBlock
	| PointsBlock
	| StatsBlock
	| ClosingBlock;

export function CaseStudy({ work }: { work: WorkItem }) {
	return (
		<article className="case-study">
			<header className="case-narrow">
				<p className="case-kicker">{work.eyebrow}</p>
				<h1>{work.title}</h1>
				<div className="case-meta">
					<div>
						<p className="case-kicker">Timeline</p>
						<p className="case-meta-copy">
							{work.timeline.map((entry) => (
								<span key={entry.when}>
									{entry.when}, <span>{entry.phase}</span>
								</span>
							))}
						</p>
					</div>
					<div>
						<p className="case-kicker">My role</p>
						<p className="case-meta-copy">
							{work.role.map((line) => (
								<span key={line}>{line}</span>
							))}
						</p>
					</div>
				</div>
				<div className="case-intro">
					{work.intro.map((paragraph) => (
						<p key={paragraph}>{paragraph}</p>
					))}
					<a href={work.site.href} target="_blank" rel="noopener noreferrer">
						{work.site.label}
					</a>
				</div>
			</header>
			<div className="case-blocks">
				{work.blocks.map((block) => (
					<CaseBlock key={blockKey(block)} block={block} />
				))}
			</div>
		</article>
	);
}

function CaseBlock({ block }: { block: WorkBlock }) {
	if (block.kind === "figure") {
		return (
			<figure className="case-figure">
				<div className="case-frame" aria-hidden="true">
					<span>{block.label}</span>
				</div>
				<figcaption>{block.caption}</figcaption>
			</figure>
		);
	}

	if (block.kind === "section") {
		return (
			<section className="case-narrow case-section">
				<h2>{block.title}</h2>
				{block.quote ? <blockquote>{block.quote}</blockquote> : null}
				{block.paragraphs.map((paragraph) => (
					<p key={paragraph}>{paragraph}</p>
				))}
			</section>
		);
	}

	if (block.kind === "points") {
		return (
			<section className="case-narrow case-section">
				<h2>{block.title}</h2>
				<p>{block.intro}</p>
				<div className="case-points">
					{block.items.map((item) => (
						<div key={item.title}>
							<h3>{item.title}</h3>
							<p>{item.body}</p>
						</div>
					))}
				</div>
			</section>
		);
	}

	if (block.kind === "stats") {
		return (
			<section className="case-narrow case-section">
				<h2>{block.title}</h2>
				<div className="case-stats">
					{block.items.map((item) => (
						<div key={item.value}>
							<p className="case-stat-value">{item.value}</p>
							<p>{item.body}</p>
						</div>
					))}
				</div>
			</section>
		);
	}

	return <p className="case-closing">{block.text}</p>;
}

function blockKey(block: WorkBlock) {
	if (block.kind === "figure") return block.caption;
	if (block.kind === "closing") return block.text;
	return block.title;
}
