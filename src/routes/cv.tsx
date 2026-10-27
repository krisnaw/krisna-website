import { createFileRoute } from "@tanstack/react-router";
import { CvPage } from "../components/cv-page";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import site from "../data/site.json" with { type: "json" };

export const Route = createFileRoute("/cv")({
	head: () => ({
		meta: [
			{ title: `CV — ${site.hero.name}` },
			{ name: "description", content: site.cv.summary },
		],
	}),
	component: CvRoute,
});

function CvRoute() {
	return (
		<>
			<SiteHeader />
			<CvPage />
			<SiteFooter />
		</>
	);
}
