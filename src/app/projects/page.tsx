import type { Metadata } from "next";
import { metadata as projectPageMetadata } from "./metadata";
import ProjectsClient from "./ProjectsClient";

// Next.js will automatically read the 'metadata' variable exported from page.tsx or layout.tsx
export const metadata: Metadata = projectPageMetadata;

export default function ProjectsPage() {
	// This component runs on the server, there is no client-side state or effects here.
	// It is only responsible for fetching data (if needed) and rendering the page structure.
	return <ProjectsClient />;
	// You can pass props from Server Component to Client Component if needed
	// return <ProjectsClient initialProjects={serverFetchedProjects} />;
}
