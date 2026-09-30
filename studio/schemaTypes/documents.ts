import { defineField, defineType } from 'sanity';

const slug = (source = 'title') => defineField({ name: 'slug', type: 'slug', options: { source, maxLength: 80 }, validation: (r) => r.required() });
const order = defineField({ name: 'order', type: 'number', description: 'Lower numbers show first' });

export const programme = defineType({
	name: 'programme',
	title: 'Programme (recital / concert)',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({ name: 'date', type: 'date' }),
		defineField({ name: 'venue', type: 'string' }),
		defineField({ name: 'summary', type: 'text', rows: 3 }),
		defineField({ name: 'image', type: 'figure' }),
		defineField({ name: 'performers', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', type: 'string' }, { name: 'role', type: 'string' }] }] }),
		defineField({ name: 'notes', type: 'blockContent' }),
		order,
		defineField({ name: 'seo', type: 'seo' }),
	],
	orderings: [{ title: 'Date', name: 'date', by: [{ field: 'date', direction: 'desc' }] }],
});

export const performance = defineType({
	name: 'performance',
	title: 'Performance (one song / piece)',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({ name: 'visible', title: 'Show on the site', type: 'boolean', initialValue: true, description: 'Turn off to hold a performance back (e.g. while waiting for permission).' }),
		defineField({ name: 'programme', type: 'reference', to: [{ type: 'programme' }] }),
		order,
		defineField({ name: 'composer', type: 'string' }),
		defineField({ name: 'poet', title: 'Words by', type: 'string' }),
		defineField({ name: 'language', type: 'string' }),
		defineField({ name: 'youtubeId', title: 'YouTube video ID', type: 'string', description: 'The part after v= in the YouTube link' }),
		defineField({ name: 'poster', type: 'figure' }),
		defineField({ name: 'duration', type: 'string', description: 'e.g. 4:44' }),
		defineField({ name: 'date', type: 'date' }),
		defineField({ name: 'venue', type: 'string' }),
		defineField({ name: 'withPerformers', title: 'Also performing', type: 'string' }),
		defineField({ name: 'originalText', title: 'Sung text (original language)', type: 'text', rows: 10 }),
		defineField({ name: 'translation', title: 'English translation', type: 'text', rows: 10 }),
		defineField({ name: 'translationCredit', title: 'Citation', type: 'string', description: 'Who wrote the words, copyright, and who translated' }),
		defineField({ name: 'textSource', title: 'Citation link', type: 'url' }),
		defineField({ name: 'notes', type: 'blockContent' }),
		defineField({ name: 'seo', type: 'seo' }),
	],
	preview: { select: { title: 'title', subtitle: 'language', media: 'poster' } },
	orderings: [{ title: 'Programme order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
});

export const stage = defineType({
	name: 'stage',
	title: 'Stage (opera / festival)',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'kind', type: 'string', options: { list: ['Opera', 'Festival', 'Concert', 'Masterclass', 'Choir'] } }),
		defineField({ name: 'year', type: 'number' }),
		defineField({ name: 'place', type: 'string' }),
		defineField({ name: 'role', type: 'string' }),
		defineField({ name: 'description', type: 'text', rows: 3 }),
		defineField({ name: 'image', type: 'figure' }),
		defineField({ name: 'performance', title: 'Linked video', type: 'reference', to: [{ type: 'performance' }] }),
		order,
	],
	orderings: [{ title: 'Timeline order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
	preview: { select: { title: 'title', subtitle: 'year' } },
});

export const photo = defineType({
	name: 'photo',
	title: 'Photograph',
	type: 'document',
	fields: [
		defineField({ name: 'image', type: 'figure', validation: (r) => r.required() }),
		defineField({ name: 'title', type: 'string' }),
		defineField({ name: 'set', type: 'string', options: { list: ['On stage', 'Recital', 'Portrait', 'Life'] } }),
		defineField({ name: 'date', type: 'date' }),
		defineField({ name: 'credit', type: 'string' }),
		order,
	],
	preview: { select: { title: 'title', subtitle: 'set', media: 'image' } },
});

export const journalEntry = defineType({
	name: 'journalEntry',
	title: 'Journal entry',
	type: 'document',
	fields: [
		defineField({ name: 'visible', title: 'Show on the site', type: 'boolean', initialValue: true }),
		defineField({ name: 'title', type: 'string', description: 'In Claire’s own words where possible' }),
		defineField({ name: 'date', type: 'date', description: 'Used for ordering. For undated pages, use the nearest date and fill in "Date as shown".', validation: (r) => r.required() }),
		defineField({ name: 'dateNote', title: 'Date as shown', type: 'string', description: 'Replaces the date on the page, e.g. "Not dated — autumn 2024"' }),
		defineField({ name: 'kind', type: 'string', options: { list: ['Morning journal', 'Afternoon journal', 'Night journal', 'Values', 'Memories', 'Journal'] } }),
		slug('title'),
		defineField({ name: 'series', type: 'string', description: 'Groups entries, e.g. "Defining my values"' }),
		defineField({ name: 'contentNote', title: 'Content note', type: 'string', description: 'Shown above the entry with the 988 line, e.g. "In this entry Claire writes about thoughts of suicide."' }),
		defineField({ name: 'body', title: 'Transcription (her words)', type: 'text', rows: 16, validation: (r) => r.required() }),
		defineField({ name: 'pages', title: 'Scanned pages', type: 'array', of: [{ type: 'figure' }] }),
		order,
	],
	orderings: [{ title: 'Notebook order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
	preview: { select: { title: 'title', subtitle: 'date', media: 'pages.0' } },
});

export const tribute = defineType({
	name: 'tribute',
	title: 'Tribute',
	type: 'document',
	fields: [
		defineField({ name: 'from', type: 'string' }),
		defineField({ name: 'relation', type: 'string', description: 'e.g. FSU voice professor, cousin, classmate' }),
		defineField({ name: 'text', type: 'text', rows: 4 }),
		defineField({ name: 'image', type: 'figure' }),
		order,
	],
	preview: { select: { title: 'from', subtitle: 'relation', media: 'image' } },
});

export const resource = defineType({
	name: 'resource',
	title: 'Help resource',
	type: 'document',
	fields: [
		defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
		defineField({ name: 'audience', type: 'string', options: { list: ['Christian counseling', 'Everyone', 'Parents & families', 'Young people', 'After a loss', 'More support'] }, initialValue: 'Everyone' }),
		defineField({ name: 'description', type: 'text', rows: 3 }),
		defineField({ name: 'call', type: 'string' }),
		defineField({ name: 'text', type: 'string', description: 'e.g. Text HOME to 741741' }),
		defineField({ name: 'url', type: 'url' }),
		order,
	],
	preview: { select: { title: 'name', subtitle: 'audience' } },
});

export const page = defineType({
	name: 'page',
	title: 'Utility page',
	type: 'document',
	fields: [
		defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
		slug(),
		defineField({ name: 'intro', type: 'text', rows: 3 }),
		defineField({ name: 'body', type: 'blockContent' }),
		defineField({ name: 'seo', type: 'seo' }),
	],
});
