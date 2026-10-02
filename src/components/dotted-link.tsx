import { useId } from "react";

export function HoverLink({
	href,
	className,
	children,
}: {
	href: string;
	className: string;
	children: string;
}) {
	const rawId = useId();
	const id = `dots-${rawId.replace(/:/g, "")}`;
	const external = href.startsWith("http");

	return (
		<a
			className={className}
			href={href}
			{...(external
				? { target: "_blank", rel: "noopener noreferrer" }
				: { rel: "noopener noreferrer" })}
		>
			<span className="dotted-link-text">
				{children}
				<DotRule id={id} />
			</span>
		</a>
	);
}

export function DottedLink({
	href,
	children,
}: {
	href: string;
	children: string;
}) {
	const rawId = useId();
	const id = `dots-${rawId.replace(/:/g, "")}`;
	const external = href.startsWith("http");

	return (
		<a
			className="dotted-link"
			href={href}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
		>
			<span className="dotted-link-text">
				{children}
				<DotRule id={id} />
			</span>
		</a>
	);
}

function DotRule({ id = "hero-rule-dots" }: { id?: string }) {
	return (
		<svg className="dot-rule" aria-hidden="true" preserveAspectRatio="none">
			<defs>
				<pattern id={id} width="6" height="4" patternUnits="userSpaceOnUse">
					<circle cx="3" cy="2" r="1" fill="currentColor" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
		</svg>
	);
}
