import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const Route = createFileRoute("/projects")({
	component: ProjectsLayout,
});

function ProjectsLayout() {
	return (
		<>
			<SiteHeader />
			<Outlet />
			<SiteFooter />
		</>
	);
}
