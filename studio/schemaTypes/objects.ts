import { defineArrayMember, defineField, defineType } from 'sanity';

// Rich text used everywhere. House rule: *italic* means Claire is speaking —
// use it only for her own words (journal lines, things she said).
export const blockContent = defineType({
	name: 'blockContent',
	title: 'Rich text',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'Heading', value: 'h3' },
				{ title: 'Quote', value: 'blockquote' },
			],
			lists: [
				{ title: 'Bullets', value: 'bullet' },
				{ title: 'Numbered', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: "Claire's words (italic)", value: 'em' },
				],
				annotations: [
					{
						name: 'link',
						type: 'object',
						title: 'Link',
						fields: [{ name: 'href', type: 'url', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel', 'sms'] }) }],
					},
				],
			},
		}),
	],
});

export const figure = defineType({
	name: 'figure',
	title: 'Image',
	type: 'image',
	options: { hotspot: true },
	fields: [
		defineField({ name: 'alt', title: 'Alt text (describe the picture)', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'caption', type: 'string' }),
	],
});

export const seo = defineType({
	name: 'seo',
	title: 'Search & sharing',
	type: 'object',
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.max(60) }),
		defineField({ name: 'description', type: 'text', rows: 2, validation: (r) => r.max(160) }),
	],
});

export const storyChapter = defineType({
	name: 'storyChapter',
	title: 'Story chapter',
	type: 'object',
	fields: [
		defineField({ name: 'eyebrow', type: 'string', description: 'Small gold label, e.g. "Clayton, North Carolina"' }),
		defineField({ name: 'heading', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'body', type: 'blockContent' }),
		defineField({ name: 'image', type: 'figure' }),
		defineField({ name: 'quote', title: "Pull quote (Claire's words)", type: 'text', rows: 2 }),
		defineField({ name: 'quoteSource', type: 'string' }),
	],
	preview: { select: { title: 'heading', subtitle: 'eyebrow', media: 'image' } },
});
