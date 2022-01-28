/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
    console.log(`[drupalpod-webext] Navigate from page "${data}"`)
  })

  // mount component to context window
  const patchLinks = document.querySelectorAll('.nodechanges-file-link')
  patchLinks.forEach((patchLink) => {
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
    /// document.body.appendChild(container)
    /// createApp(App).mount(root)

    patchLink.appendChild(container)
    console.log(patchLink)
    createApp(App).mount(patchLink)
  })
})()
