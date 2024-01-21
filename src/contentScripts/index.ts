import { onMessage, sendMessage } from 'webext-bridge'
import { createApp } from 'vue'
import { setupApp } from '~/logic/common-setup'
// import App from './views/App.vue'
import patchButton from './views/patchButton.vue'
import branchButton from './views/branchButton.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
( async () => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
    console.log(`[drupalpod-webext] Navigate from page "${data}"`)
  })

  // Read important data from the page

  const loggedIn = !!document.querySelector('.person')
  console.debug('loggedIn: ', loggedIn)
  const pushAccess = !!document.querySelector('.push-access')
  console.debug('pushAccess: ', pushAccess)
  const issueFork = document.querySelector('.fork-link') && document.querySelector('.fork-link').innerText
  if (issueFork)
    console.debug('issueFork: ', issueFork)
  else
    console.debug('No issue fork')
  const moduleVersion = document.querySelector('.field-name-field-issue-version') && document.querySelector('.field-name-field-issue-version').children[1].innerText.replace('-dev', '')

  let globalInfo = Object.assign({ loggedIn, pushAccess, issueFork, moduleVersion })

  // Original URL
  const canonicalURL = document.querySelector('link[rel=\'canonical\']')!.href

  console.log('canonicalURL: ', canonicalURL)
  // Get the project name
  const projectName: string = canonicalURL.split('/')[4]
  console.log('projectname: ', projectName)
  // to avoid extension CORS issues, we need to get the data from the background script
  const { projectType, releasesInfo, xml } = await sendMessage('get-project-releases', { projectName });
  console.log('releasesInfo: ', releasesInfo)
  console.log('projectType: ', projectType)
  console.log('xml: ', xml)

  globalInfo = {
    ...globalInfo,
    releasesInfo,
    projectType,
  }
  console.log('latest globalInfo: ', globalInfo)
    // mount component to context window
    const patchLinks = findPatchesInPage()
    patchLinks.forEach((patchLink) => { addPatchButtons(patchLink) })

    const allBranches = document.querySelector('.branches') && document.querySelector('.branches')!.children
    if (allBranches)
      Array.from(allBranches).forEach((branch) => { addBranchButtons(branch, globalInfo) })

})()
// Add buttons next to elements
function addBranchButtons(branch: HTMLElement, globalInfo: object) {
  const container = document.createElement('span')
  const root = document.createElement('span')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  // document.body.appendChild(container)
  // const app = createApp(App)
  // setupApp(app)
  // app.mount(root)

  branch.firstChild!.before(container)

  // 1. Assign app to a variable
  const app = createApp(branchButton)
  // 2. Assign the global variable before mounting
  app.config.globalProperties.$currentBranch = branch.dataset.branch
  app.config.globalProperties.$globalInfo = globalInfo

  // 3. Use router and mount app
  app.mount(root)
}

function addPatchButtons(patchLink: HTMLAnchorElement) {
  const container = document.createElement('span')
  const root = document.createElement('span')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  patchLink.parentElement && patchLink.parentElement.before(container)
  createApp(patchButton).mount(root)
}

// Find all patch links in the page
function findPatchesInPage() {
  const allLinks = document.querySelectorAll('a')

  const patchesRegex = /^(https:\/\/www.drupal.org\/files\/issues\/).*\.(patch|diff)$/
  // find specific links in AllLinks
  const patchLinks = Array.from(allLinks).filter((link) => {
    return (patchesRegex.test(link.href) === true)
  })

  return patchLinks
}
