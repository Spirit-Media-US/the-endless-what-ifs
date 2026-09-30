import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';

export const sanityClient = createClient({
	projectId: 'yu45ypx3',
	dataset: 'production',
	useCdn: false, // build-time only; always read the latest published content
	apiVersion: '2024-01-01',
});

const builder = createImageUrlBuilder(sanityClient);
export function urlFor(source: Parameters<typeof builder.image>[0]) {
	return builder.image(source);
}

/** Responsive WebP srcset + intrinsic size for a Sanity image (Trait 1 / Trait 8). */
export function img(source: any, widths: number[] = [640, 1000, 1400], ratio?: number) {
	if (!source?.asset) return null;
	const dims = source.asset?.metadata?.dimensions;
	const r = ratio ?? (dims ? dims.height / dims.width : 1);
	const max = widths[widths.length - 1];
	const at = (w: number) => {
		let b = urlFor(source).width(w).format('webp').quality(80);
		if (ratio) b = b.height(Math.round(w * ratio)).fit('crop');
		return b.url();
	};
	return {
		src: at(max),
		srcset: widths.map((w) => `${at(w)} ${w}w`).join(', '),
		width: max,
		height: Math.round(max * r),
		alt: source.alt ?? '',
		caption: source.caption ?? '',
	};
}

export function rich(blocks: any): string {
	if (!blocks?.length) return '';
	return toHTML(blocks, {
		components: {
			marks: {
				link: ({ children, value }) => {
					const href = value?.href ?? '#';
					const ext = /^https?:/.test(href);
					return `<a href="${href}"${ext ? ' rel="noopener" target="_blank"' : ''}>${children}</a>`;
				},
			},
		},
	});
}

export const IMG = `{..., asset->{_id, url, metadata{dimensions, lqip}}}`;

export const q = {
	settings: `*[_id == "siteSettings"][0]{..., shareImage${IMG}}`,
	home: `*[_id == "home"][0]{..., heroImage${IMG}, signoff${IMG}, chapters[]{..., image${IMG}},
		featuredPerformance->{title, "slug": slug.current, youtubeId, duration, date, poster${IMG}, programme->{title, date}}}`,
	programmes: `*[_type == "programme"] | order(date desc){..., "slug": slug.current, image${IMG},
		"performances": *[_type == "performance" && references(^._id) && visible != false] | order(order asc){title, "slug": slug.current, composer, language, duration, youtubeId, poster${IMG}}}`,
	performances: `*[_type == "performance" && visible != false]{..., "slug": slug.current, poster${IMG},
		programme->{title, "slug": slug.current, date, venue}}`,
	stages: `*[_type == "stage"] | order(coalesce(order, 999) asc, year asc){..., image${IMG}, performance->{title, "slug": slug.current}}`,
	photos: `*[_type == "photo"] | order(coalesce(order, 999) asc, date asc){..., image${IMG}}`,
	tributes: `*[_type == "tribute"] | order(coalesce(order, 999) asc){..., image${IMG}}`,
	journals: `*[_type == "journalEntry"] | order(date asc){..., "slug": slug.current, pages[]${IMG}}`,
	book: `*[_id == "book"][0]{..., cover${IMG}}`,
	author: `*[_id == "author"][0]{..., headshot${IMG}, "pressFiles": pressFiles[]{label, "url": asset->url}}`,
	resources: `*[_type == "resource"] | order(coalesce(order, 999) asc){...}`,
	pages: `*[_type == "page"]{..., "slug": slug.current}`,
};

export const fmtDate = (d?: string, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) =>
	d ? new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { ...opts, timeZone: 'UTC' }) : '';
