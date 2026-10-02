import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const Route = createFileRoute("/notes")({
	component: NotesLayout,
});

function NotesLayout() {
	return (
		<>
			<SiteHeader />
			<Outlet />
			<SiteFooter />
		</>
	);
}
