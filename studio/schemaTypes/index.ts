import { performance, journalEntry, page, photo, programme, resource, stage, tribute } from './documents';
import { blockContent, figure, seo, storyChapter } from './objects';
import { author, book, home, siteSettings } from './singletons';

export const SINGLETONS = ['siteSettings', 'home', 'book', 'author'];

export const schemaTypes = [
	blockContent, figure, seo, storyChapter,
	siteSettings, home, book, author,
	programme, performance, stage, photo, journalEntry, tribute, resource, page,
];
