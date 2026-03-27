import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'rb9fvomb',
    dataset: 'production'
  },
  deployment: {
    appId: 'nqh75num8f09zkaeh1jodepc',
    autoUpdates: true,
  }
})
