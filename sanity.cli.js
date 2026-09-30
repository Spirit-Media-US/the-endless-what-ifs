import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'REPLACE_PROJECT_ID',
    dataset: 'production',
  },
  studioHost: 'REPLACE_SITE_SLUG',
})
