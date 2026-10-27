import site from "../data/site.json" with { type: "json" };
import { DottedLink } from "./dotted-link";

export function ContactCard() {
	const { avatar } = site.hero;
	const { lead, body, note, email, call } = site.contact;

	return (
		<section className="contact-card" aria-label="Contact">
			<div className="contact-card-intro">
				<span className="contact-card-avatar">
					<img src={avatar.src} alt="" width={44} height={44} />
					<span className="contact-card-status" />
				</span>
				<div className="contact-card-copy">
					<p>{lead}</p>
					<p>{body}</p>
				</div>
			</div>
			<div className="contact-card-actions">
				<a className="contact-call" href={call.href}>
					{call.label}
					<span className="contact-call-icon" aria-hidden="true">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
							<path d="m21.854 2.147-10.94 10.939" />
						</svg>
					</span>
				</a>
			</div>
			<p className="contact-card-note">
				{note}
				<DottedLink href={email.href}>{email.label}</DottedLink>.
			</p>
		</section>
	);
}
