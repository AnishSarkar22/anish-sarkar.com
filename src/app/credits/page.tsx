// // app/projects/page.tsx

// import type { Metadata } from 'next';

// // 1. Import metadata FROM SEPARATE FILE './metadata.ts'
// import { metadata as creditPageMetadata } from './metadata';

// // 2. Import Client Component (contains UI and interaction logic)
// import CreditsClient from './CreditsClient';

// // 3. Export metadata object for Next.js use
// // Next.js will automatically read the 'metadata' variable exported from page.tsx or layout.tsx
// export const metadata: Metadata = creditPageMetadata;

// // 4. This Server Component simply renders the Client Component.
// export default function CreditsPage() {
//   // This component runs on the server, there is no client-side state or effects here.
//   // It is only responsible for fetching data (if needed) and rendering the page structure.
//   return <CreditsClient />;
//   // You can pass props from Server Component to Client Component if needed
//   // return <ProjectsClient initialProjects={serverFetchedProjects} />;
// }