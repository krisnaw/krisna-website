import site from "../data/site.json" with { type: "json" };
import { HoverLink } from "./dotted-link";

export function SiteFooter() {
	const { social } = site.footer;

	return (
		<footer className="site-footer">
			<div className="frame">
				<hr className="hero-rule footer-rule" />
			</div>
			<div className="frame footer-body">
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
			</div>
		</footer>
	);
}
