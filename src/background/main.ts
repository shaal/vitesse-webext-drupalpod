import { onMessage, sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})
onMessage('get-project-releases', async ({ projectName }) => {
  debugger
  try {
    const result = await getProjectReleases(projectName)
    console.log('result: ', result)
    return result
  }
  catch (error) {
    console.error('Failed to get project releases', error)
    return {
      error: 'Failed to fetch project releases',
    }
  }
})

async function getProjectReleases(projectName: string) {
  const url = `https://updates.drupal.org/release-history/${projectName}/current`
  console.log('url: ', url)
  const releasesInfo: { releaseVersion: string | null; releaseStatus: string | null; releaseCoreCompatibility: string | null; releaseDate: string | null }[] = []
  try {
    const response = await fetch(url)
    const str = await response.text()
    const xml = new window.DOMParser().parseFromString(str, 'text/xml')
    console.log('xml: ', xml)
    const projectType = xml.querySelector('type') && xml.querySelector('type')!.textContent
    if (projectType) {
      xml.querySelector('releases')!.querySelectorAll('release').forEach((release) => {
        const releaseVersion = release.querySelector('version')!.textContent
        const releaseStatus = release.querySelector('status')!.textContent
        const releaseCoreCompatibility = projectType !== 'project_core' ? release.querySelector('core_compatibility')!.textContent : null
        const releaseDate = release.querySelector('date') && release.querySelector('date')!.textContent
        releasesInfo.push({ releaseVersion, releaseStatus, releaseCoreCompatibility, releaseDate })
      })
    }
    return { projectType, releasesInfo, xml }
  }
  catch (error) {
    console.error('Failed to fetch or parse project releases', error)
    throw error
  }
}
