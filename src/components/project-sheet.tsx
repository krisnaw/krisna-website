export type ProjectSheetItem = {
	slug: string;
	name: string;
	title: string;
	site: { label: string; href: string };
	tags: string[];
	time: string;
	team: string;
	sections: { label: string; body: string }[];
	quote?: { text: string; highlight?: string };
	media: { src: string; alt: string; caption?: string }[];
};

export function ProjectSheet({ work }: { work: ProjectSheetItem }) {
	return (
		<article className="project-sheet">
			<div className="project-sheet-inner">
				<div className="project-sheet-copy">
					<div className="project-sheet-head">
						<p className="project-sheet-name">{work.name}</p>
						<h1>{work.title}</h1>
						<a
							className="project-sheet-site"
							href={work.site.href}
							target="_blank"
							rel="noopener noreferrer"
						>
							{work.site.label}
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M5.83334 5.83398H14.1667V14.1673"
									stroke="currentColor"
									strokeWidth="1.33"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M5.83334 14.1673L14.1667 5.83398"
									stroke="currentColor"
									strokeWidth="1.33"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</a>
						{work.tags.length > 0 ? (
							<ul className="project-sheet-tags">
								{work.tags.map((tag) => (
									<li key={tag}>{tag}</li>
								))}
							</ul>
						) : null}
					</div>

					<dl className="project-sheet-meta">
						<div>
							<dt>Time</dt>
							<dd>{work.time}</dd>
						</div>
						<div>
							<dt>Team</dt>
							<dd>{work.team}</dd>
						</div>
					</dl>

					<div className="project-sheet-sections">
						{work.sections.map((section) => (
							<section key={section.label}>
								<h2>{section.label}</h2>
								<p>{section.body}</p>
							</section>
						))}
					</div>

					{work.quote ? (
						<blockquote className="project-sheet-quote">
							“
							{work.quote.highlight &&
							work.quote.text.includes(work.quote.highlight) ? (
								<>
									{work.quote.text.slice(
										0,
										work.quote.text.indexOf(work.quote.highlight),
									)}
									<span>{work.quote.highlight}</span>
									{work.quote.text.slice(
										work.quote.text.indexOf(work.quote.highlight) +
											work.quote.highlight.length,
									)}
								</>
							) : (
								work.quote.text
							)}
							”
						</blockquote>
					) : null}
				</div>

				<div className="project-sheet-media">
					{work.media.map((item) => (
						<figure key={item.src + (item.caption ?? "")}>
							<div className="project-sheet-frame">
								<img src={item.src} alt={item.alt} loading="lazy" />
							</div>
							{item.caption ? <figcaption>{item.caption}</figcaption> : null}
						</figure>
					))}
				</div>
			</div>
		</article>
	);
}
