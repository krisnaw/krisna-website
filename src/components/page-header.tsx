export function PageHeader({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<div className="page-intro">
			<h1>{title}</h1>
			{description ? <p>{description}</p> : null}
		</div>
	);
}
