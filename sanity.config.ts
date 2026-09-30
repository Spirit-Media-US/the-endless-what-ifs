import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { SINGLETONS, schemaTypes } from './studio/schemaTypes';
import { structure } from './studio/structure';

export default defineConfig({
	name: 'the-endless-what-ifs',
	title: 'The Endless What Ifs',
	projectId: 'yu45ypx3',
	dataset: 'production',
	basePath: '/studio',
	plugins: [structureTool({ structure }), visionTool(), media()],
	schema: {
		types: schemaTypes,
		templates: (t) => t.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
	},
	document: {
		actions: (input, { schemaType }) =>
			SINGLETONS.includes(schemaType) ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : input,
	},
});
