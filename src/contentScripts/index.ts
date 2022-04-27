/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
// import App from './views/App.vue'
import patchButton from './views/patchButton.vue'
import branchButton from './views/branchButton.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
    console.log(`[drupalpod-webext] Navigate from page "${data}"`)
  })

  // mount component to context window
  const patchLinks = findPatchesInPage()
  patchLinks.forEach((patchLink) => { addPatchButtons(patchLink) })

  const pathArray = window.location.pathname.split('/')
  console.debug('pathArray: ', pathArray)

  const allBranches = document.querySelector('.branches') && document.querySelector('.branches').children
  Array.from(allBranches).forEach((branch) => { addBranchButtons(branch) })

  // const issueBranches = []
  // Array.from(allBranches).forEach((element) => {
  //   issueBranches.push(element.dataset.branch)
  // })
  // console.debug('issueBranches', issueBranches)

  // Array.from(allBranches).forEach((issueBranch) => { console.log('hi!', issueBranch) })

  const issueFork = document.querySelector('.fork-link') && document.querySelector('.fork-link').innerText
  if (issueFork)
    console.debug('issueFork: ', issueFork)
  else
    console.debug('No issue fork')

  const loggedIn = !!document.querySelector('.person')
  console.debug('loggedIn: ', loggedIn)
  const pushAccess = !!document.querySelector('.push-access')
  console.debug('pushAccess: ', pushAccess)
})()

// Add buttons next to elements
function addBranchButtons(branch: HTMLAnchorElement) {
  const container = document.createElement('span')
  const root = document.createElement('span')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)

  console.debug('branch.parentElement: ', branch.parentElement)
  console.debug('container: ', container)

  branch.firstChild.before(container)
  createApp(branchButton).mount(root)
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
