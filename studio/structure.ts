import type { StructureResolver } from 'sanity/structure';

const single = (S: any, id: string, title: string) =>
	S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id));

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Claire’s site')
		.items([
			single(S, 'home', 'Home — Claire’s story'),
			S.divider(),
			S.documentTypeListItem('programme').title('Her work — programmes'),
			S.documentTypeListItem('performance').title('Her work — performances'),
			S.documentTypeListItem('stage').title('Her work — stages'),
			S.documentTypeListItem('photo').title('Photographs'),
			S.documentTypeListItem('tribute').title('How she’s remembered'),
			S.divider(),
			S.documentTypeListItem('journalEntry').title('Journals'),
			S.divider(),
			single(S, 'book', 'The book'),
			single(S, 'author', 'Haley'),
			S.documentTypeListItem('resource').title('Help resources'),
			S.documentTypeListItem('page').title('Utility pages'),
			S.divider(),
			single(S, 'siteSettings', 'Site settings'),
		]);
