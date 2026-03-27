import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'badea-gheorghe',

  projectId: 'rb9fvomb',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  studio: {
    hostname: 'https://badea-gheorghe.sanity.studio',
  },

  schema: {
    types: schemaTypes,
  },
})
