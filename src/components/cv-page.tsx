import site from "../data/site.json" with { type: "json" };
import { DottedLink, HoverLink } from "./dotted-link";

export function CvPage() {
	const { name } = site.hero;
	const { location, summary, experience, skills, education, availability } =
		site.cv;
	const email = site.footer.social.find((item) =>
		item.href.startsWith("mailto:"),
	);

	return (
		<main className="cv">
			<header className="cv-intro">
				<div className="cv-identity">
					<h1>{name}</h1>
					<p className="cv-location">{location}</p>
				</div>
				<p className="cv-summary">{summary}</p>
				<div className="social-row">
					{site.footer.social.map((item) => (
						<HoverLink
							key={item.label}
							className="social-link"
							href={item.href}
						>
							{item.label}
						</HoverLink>
					))}
				</div>
			</header>

			<hr className="hero-rule" />

			<section className="cv-section" aria-labelledby="cv-experience">
				<h2 id="cv-experience" className="cv-label">
					Experience
				</h2>
				<div className="cv-entries">
					{experience.map((job) => (
						<article key={`${job.org}-${job.dates}`}>
							<div className="cv-role-head">
								<h3>
									{job.role}
									<span className="cv-org"> · {job.org}</span>
								</h3>
								<p className="cv-dates">{job.dates}</p>
							</div>
							{job.place ? <p className="cv-place">{job.place}</p> : null}
							<ul className="cv-points">
								{job.points.map((point) => (
									<li key={point}>{point}</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</section>

			<hr className="hero-rule" />

			<section className="cv-section" aria-labelledby="cv-skills">
				<h2 id="cv-skills" className="cv-label">
					Skills
				</h2>
				<dl className="cv-skills">
					{skills.map((group) => (
						<div className="cv-skill" key={group.label}>
							<dt>{group.label}</dt>
							<dd>{group.items}</dd>
						</div>
					))}
				</dl>
			</section>

			<hr className="hero-rule" />

			<section className="cv-section" aria-labelledby="cv-education">
				<h2 id="cv-education" className="cv-label">
					Education
				</h2>
				<div className="cv-schools">
					{education.map((school) => (
						<article key={school.title}>
							<div className="cv-school-head">
								<h3>{school.title}</h3>
								{school.dates ? (
									<p className="cv-dates">{school.dates}</p>
								) : null}
							</div>
							<p className="cv-place">{school.place}</p>
							{school.detail ? (
								<p className="cv-detail">{school.detail}</p>
							) : null}
						</article>
					))}
				</div>
			</section>

			<hr className="hero-rule" />

			<section className="cv-section" aria-labelledby="cv-availability">
				<h2 id="cv-availability" className="cv-label">
					Availability
				</h2>
				<p className="cv-availability">{availability}</p>
				{email ? (
					<p className="cv-place">
						<DottedLink href={email.href}>
							{email.href.replace("mailto:", "")}
						</DottedLink>
					</p>
				) : null}
			</section>
		</main>
	);
}
