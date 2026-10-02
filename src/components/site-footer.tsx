import { HoverLink } from "./dotted-link";

const SPRITES = [
	["🌵", "hyderabad heat", "0ms"],
	["🌸", "touch grass", "70ms"],
	["👾", "ship it", "140ms"],
	["🪴", "slow growth", "210ms"],
	["✳️", "hand-built", "280ms"],
] as const;

const SOCIAL = [
	["X", "https://x.com/urstruelysv"],
	["Instagram", "https://www.instagram.com/urstruelysv/"],
	["GitHub", "https://github.com/urstruelysv"],
	["LinkedIn", "https://www.linkedin.com/in/sai-vamshi-375997194"],
	["Peerlist", "https://peerlist.io/urstruelysv"],
	["Medium", "https://medium.com/@urstruelysv"],
	["Email", "mailto:krisna.w2010@gmail.com"],
] as const;

export function SiteFooter() {
	return (
		<footer className="site-footer">
			<div className="frame">
				<hr className="hero-rule footer-rule" />
			</div>
			<div className="frame footer-body">
				<div className="sprite-row">
					{SPRITES.map(([emoji, label, delay]) => (
						<span key={label} className="sprite-item">
							<span className="sprite" style={{ animationDelay: delay }}>
								<span className="sprite-emoji" role="img" aria-label={label}>
									{emoji}
								</span>
							</span>
							<span className="sprite-tip" aria-hidden="true">
								{label}
							</span>
						</span>
					))}
				</div>
				<div className="social-row">
					{SOCIAL.map(([label, href]) => (
						<HoverLink key={label} className="social-link" href={href}>
							{label}
						</HoverLink>
					))}
				</div>
				<p className="footer-meta">Last updated September 2026</p>
				<p className="footer-meta">© Sai Vamshi Gannoju.</p>
			</div>
		</footer>
	);
}
