import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site settings',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'description', type: 'text', rows: 2 }),
		defineField({ name: 'crisisHeadline', title: 'Crisis band — headline', type: 'string', initialValue: 'Call or text 988' }),
		defineField({ name: 'crisisText', title: 'Crisis band — text', type: 'string' }),
		defineField({ name: 'footerDedication', type: 'string', initialValue: 'In memory of Claire Rose Goodwin, 2003–2024' }),
		defineField({ name: 'shareImage', type: 'figure' }),
	],
});

export const home = defineType({
	name: 'home',
	title: 'Home — Claire’s story',
	type: 'document',
	fields: [
		defineField({ name: 'heroImage', type: 'figure', validation: (r) => r.required() }),
		defineField({ name: 'heroEyebrow', type: 'string' }),
		defineField({ name: 'heroName', type: 'string', initialValue: 'Claire Rose Goodwin' }),
		defineField({ name: 'heroDates', type: 'string' }),
		defineField({ name: 'heroLine', type: 'text', rows: 2 }),
		defineField({ name: 'signoff', title: 'Handwritten sign-off (scan)', type: 'figure' }),
		defineField({ name: 'signoffText', title: 'Sign-off as text', type: 'string' }),
		defineField({ name: 'chapters', title: 'Her story', type: 'array', of: [{ type: 'storyChapter' }] }),
		defineField({ name: 'featuredPerformance', type: 'reference', to: [{ type: 'performance' }] }),
		defineField({ name: 'seo', type: 'seo' }),
	],
	preview: { prepare: () => ({ title: 'Home — Claire’s story' }) },
});

export const book = defineType({
	name: 'book',
	title: 'The book',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'subtitle', type: 'string' }),
		defineField({ name: 'author', type: 'string' }),
		defineField({ name: 'cover', type: 'figure' }),
		defineField({ name: 'tagline', type: 'string' }),
		defineField({ name: 'description', type: 'blockContent' }),
		defineField({ name: 'authorWhy', title: 'Why Haley wrote it (her words)', type: 'text', rows: 5 }),
		defineField({ name: 'excerptTitle', type: 'string' }),
		defineField({ name: 'excerpt', type: 'blockContent' }),
		defineField({ name: 'releaseDate', type: 'date' }),
		defineField({ name: 'releaseNote', type: 'string', description: 'Shown until a date is set, e.g. "Coming autumn 2026"' }),
		defineField({
			name: 'formats',
			type: 'array',
			description: 'Buy buttons appear only for formats that have at least one retailer link.',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'format', type: 'string', options: { list: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'] } },
						{ name: 'isbn', type: 'string' },
						{ name: 'price', type: 'string' },
						{
							name: 'retailers',
							type: 'array',
							of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'url', type: 'url' }] }],
						},
					],
					preview: { select: { title: 'format', subtitle: 'isbn' } },
				},
			],
		}),
		defineField({ name: 'seo', type: 'seo' }),
	],
});

export const author = defineType({
	name: 'author',
	title: 'Haley (author)',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'headshot', type: 'figure' }),
		defineField({ name: 'shortBio', type: 'text', rows: 3 }),
		defineField({ name: 'bio', type: 'blockContent' }),
		defineField({ name: 'topics', title: 'Speaking topics', type: 'array', of: [{ type: 'string' }] }),
		defineField({ name: 'pressFiles', title: 'Press downloads', type: 'array', of: [{ type: 'file', fields: [{ name: 'label', type: 'string' }] }] }),
		defineField({ name: 'seo', type: 'seo' }),
	],
});
