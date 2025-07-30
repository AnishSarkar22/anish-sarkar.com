import type { Metadata } from 'next';

// 1. Import metadata FROM SEPARATE FILE './metadata.ts'
import { metadata as photosPageMetadata } from './metadata';

// 2. Import Client Component (contains UI and interaction logic)
import PhotosClient from './PhotosClient';

// 3. Export metadata object for Next.js use
// Next.js will automatically read the 'metadata' variable exported from page.tsx or layout.tsx
export const metadata: Metadata = photosPageMetadata;

// 4. This Server Component simply renders the Client Component
export default function PhotosPage() {
  // This component runs on the server, there is no client-side state or effects here
  // It is only responsible for fetching data (if needed) and rendering the page structure
  return <PhotosClient />;
  // You can pass props from Server Component to Client Component if needed
  // return <PhotosClient initialPhotos={serverFetchedPhotos} />;
}