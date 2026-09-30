import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// TODO: Replace with the new site's Sanity project ID
export const sanityClient = createClient({
  projectId: 'REPLACE_PROJECT_ID',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

const builder = createImageUrlBuilder(sanityClient);
export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
