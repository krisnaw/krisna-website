import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

export function SiteFooter() {
	const { sprites, social, updated, copyright } = site.footer;

	return (
		<footer className="site-footer">
			<div className="frame">
				<hr className="hero-rule footer-rule" />
			</div>
			<div className="frame footer-body">
				<div className="sprite-row">
					{sprites.map((sprite, index) => (
						<span key={sprite.label} className="sprite-item">
							<span
								className="sprite"
								style={{ animationDelay: `${index * 70}ms` }}
							>
								<span
									className="sprite-emoji"
									role="img"
									aria-label={sprite.label}
								>
									{sprite.emoji}
								</span>
							</span>
							<span className="sprite-tip" aria-hidden="true">
								{sprite.label}
							</span>
						</span>
					))}
				</div>
				<div className="social-row">
					{social.map((item) => (
						<HoverLink
							key={item.label}
							className="social-link"
							href={item.href}
						>
							{item.label}
						</HoverLink>
					))}
				</div>
				<p className="footer-meta">{updated}</p>
				<p className="footer-meta">{copyright}</p>
			</div>
		</footer>
	);
}
