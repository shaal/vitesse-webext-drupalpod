<script lang="ts">
// import Logo from './Logo.vue'
export default {
  name: 'Test',
  data() {
    return {
      project_name: '',
      loggedIn: false,
      pushAccess: false,
      issue_fork: '',
      drupal_core: '9.4.x',
      install_profile: '',
      patch_file: '',
      php_version: '8.0',
      php_versions: [
        '8.1',
        '8.0',
        '7.4',
        '7.3',
      ],
      drupal_core_versions: [
        {
          name: 'Latest 8.9.x',
          value: '8.9.x',
          min_php: '7.3',
          max_php: '7.4',
        },
        {
          name: 'Latest 9.3',
          value: '9.3.12',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '9.3.x',
          value: '9.3.x',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '9.4.x',
          value: '9.4.x',
          min_php: '7.3',
          max_php: '8.1',
        },
        {
          name: '10.0.x',
          value: '10.0.x',
          min_php: '8.1',
          max_php: '8.1',
        },
      ],
    }
  },
  computed: {
    issue_branch() {
      return this.$currentBranch
    },
    // issue_fork() {
    //   return this.$currentIssueFork
    // },
    drupalpod_link() {
      const DPLink = 'https://gitpod.io/#'
      const DPProject = this.project_name ? `DP_PROJECT_NAME=${this.project_name},` : ''
      const DP_PHP_VERSION = this.php_version ? `DP_PHP_VERSION=${this.php_version},` : ''
      const DP_ISSUE_FORK = this.issue_fork ? `DP_ISSUE_FORK=${this.issue_fork},` : ''
      const DP_ISSUE_BRANCH = this.issue_branch ? `DP_ISSUE_BRANCH=${this.issue_branch},` : ''
      const DP_PROJECT_TYPE = this.project_type ? `DP_PROJECT_TYPE=${this.project_type},` : ''
      const DP_MODULE_VERSION = this.module_version ? `DP_MODULE_VERSION=${this.module_version},` : ''
      const DP_CORE_VERSION = this.drupal_core ? `DP_CORE_VERSION=${this.drupal_core},` : ''
      const DP_PATCH_FILE = this.patch_file ? `DP_PATCH_FILE=${this.patch_file},` : ''
      const DP_INSTALL_PROFILE = this.install_profile ? `DP_INSTALL_PROFILE=${this.install_profile},` : ''

      const DPRepo = '/https://git.drupalcode.org/project/drupalpod'
      return DPLink + DPProject + DP_PHP_VERSION + DP_ISSUE_FORK + DP_ISSUE_BRANCH + DP_PROJECT_TYPE + DP_MODULE_VERSION + DP_CORE_VERSION + DP_PATCH_FILE + DP_INSTALL_PROFILE + DPRepo
    },
    // https://gitpod.io/#DP_PROJECT_NAME=drupal,DP_ISSUE_FORK=drupal-3223264,DP_ISSUE_BRANCH=3223264-olivero-messages-can,DP_PROJECT_TYPE=project_core,DP_MODULE_VERSION=9.5.x,DP_CORE_VERSION=9.2.x,DP_PATCH_FILE=https%3A%2F%2Fwww.drupal.org%2Ffiles%2Fissues%2F2022-05-30%2F3223264-10.0.x-37.patch,DP_INSTALL_PROFILE=demo_umami/https://github.com/shaal/drupalpod
  },
  // mounted() {
  beforeMount() {
    this.getGlobalInfo()
    this.project_name = 'drupal'
    // if project_type is Drupal core, set core by default to module_version, otherwise set to latest stable version
    if (this.project_type === 'project_core') {
      this.drupal_core = this.module_version
      console.log('setting drupal_core default to module_version', this.drupal_core)
    }
  },
  methods: {
    getGlobalInfo() {
      this.loggedIn = this.$globalInfo.loggedIn
      this.pushAccess = this.$globalInfo.pushAccess
      this.module_version = this.$globalInfo.moduleVersion
      this.issue_fork = this.$globalInfo.issueFork
      this.project_type = this.$globalInfo.projectType
    },
    supportedPHPVersions(supported) {
      // loop through all PHP versions
      return this.php_versions.filter((current_php_version) => {
        // find current version in drupal_core_versions
        const drupalCore = this.drupal_core_versions.find((version) => {
          return version.value === this.drupal_core
        })
        // current core version not found, no information for its min/max supported versions
        if (!drupalCore)
          return false

        // check if the current PHP version is supported by the current code version
        if (supported)
          return (current_php_version >= drupalCore.min_php && current_php_version <= drupalCore.max_php)
        else
          return (current_php_version < drupalCore.min_php || current_php_version > drupalCore.max_php)
      })
    },

  },
}
</script>

<template>
  <details class="main">
    <summary>
      <div class="logo">
        <Logo />
      </div>
    </summary>
    <p>Default options to open drupalpod: </p>
    <div>(display variables from storage ())</div>
    <div>
      <form v-if="project_type !== 'project_core'">
        <!-- If this is core issue, mark the issue version first -->
        <label for="core-select">Choose a Drupal core version:</label>
        <select
          id="core-select" v-model="drupal_core" name="core-select"
        >
          <option v-for="version in drupal_core_versions" :key="version.value" :value="version.value">
            {{ version.name }}
          </option>
        </select>
      </form>
      <h3 class="launch">
        <a :href="drupalpod_link" target="_blank" rel="noopener noreferrer">
          🚀 Launch DrupalPod 🚀
        </a>
      </h3>
    </div>
    <div v-if="!loggedIn || !pushAccess" class="warning">
      <strong>Warning: you won't be able to push code unless these issues are resolved:</strong>
      <ul>
        <li v-if="!loggedIn">
          You are not logged in
        </li>
        <li v-if="loggedIn && !pushAccess">
          You don't have push access
        </li>
      </ul>
    </div>
    <details>
      <summary class="advanced">
        Advanced Options:
      </summary>
      <form>
        <fieldset>
          <!-- Pattern support versions like 10.0.x or 9.3.4 or 8.9 -->
          <!-- https://input-pattern.com/en/tutorial.php -->
          <label for="advanced-core-version">Drupal Core:</label>
          <input
            id="advanced-core-version"
            v-model="drupal_core"
            pattern="[0-9]{1,2}\.[0-9]{1,2}((\.[x])|(\.[0-9]{1,2}))?" list="drupal-core-data" name="drupal-core" size="8" required autocomplete="off"
          >
          <datalist id="drupal-core-data">
            <option v-for="version in drupal_core_versions" :key="version.value" :value="version.value">
              {{ version.name }}
            </option>
          </datalist>

          <label for="php-version">PHP version:</label>
          <select
            id="php-version"
            v-model="php_version"
            name="php-version"
          >
            <template v-if="supportedPHPVersions(true).length > 0">
              <optgroup
                :label="`Supported by ${drupal_core}`"
              >
                <option v-for="version in supportedPHPVersions(true)" :key="version">
                  {{ version }}
                </option>
              </optgroup>
              <optgroup
                v-if="supportedPHPVersions(false).length > 0"
                :label="`Not supported by ${drupal_core}`"
              >
                <option v-for="version in supportedPHPVersions(false)" :key="version">
                  {{ version }}
                </option>
              </optgroup>
            </template>
            <template v-else>
              <option v-for="version in php_versions" :key="version" :value="version">
                {{ version }}
              </option>
            </template>
          </select>
          Core: 9.4 (core issue version: )

          Advanced:
          Modules:
          [ ] Devel
          [ ] Admin Toolbar
          [ ] Admin Toolbar

          Themes:
          [ ] Olivero
          [ ] Claro (admin)

          * save current settings as new default
        </fieldset>
      </form>
    </details>
  <!--
    <input list="php-versions" placeholder="Choose PHP version">
    <datalist id="php-versions">
      <option>7.4</option>
      <option>8.0</option>
      <option>8.1</option>
    </datalist>
    -->
  </details>
</template>

<style scoped>
  input:invalid {
    /* color: white; */
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeVJREFUeNqkU01oE1EQ/mazSTdRmqSxLVSJVKU9RYoHD8WfHr16kh5EFA8eSy6hXrwUPBSKZ6E9V1CU4tGf0DZWDEQrGkhprRDbCvlpavan3ezu+LLSUnADLZnHwHvzmJlvvpkhZkY7IqFNaTuAfPhhP/8Uo87SGSaDsP27hgYM/lUpy6lHdqsAtM+BPfvqKp3ufYKwcgmWCug6oKmrrG3PoaqngWjdd/922hOBs5C/jJA6x7AiUt8VYVUAVQXXShfIqCYRMZO8/N1N+B8H1sOUwivpSUSVCJ2MAjtVwBAIdv+AQkHQqbOgc+fBvorjyQENDcch16/BtkQdAlC4E6jrYHGgGU18Io3gmhzJuwub6/fQJYNi/YBpCifhbDaAPXFvCBVxXbvfbNGFeN8DkjogWAd8DljV3KRutcEAeHMN/HXZ4p9bhncJHCyhNx52R0Kv/XNuQvYBnM+CP7xddXL5KaJw0TMAF8qjnMvegeK/SLHubhpKDKIrJDlvXoMX3y9xcSMZyBQ+tpyk5hzsa2Ns7LGdfWdbL6fZvHn92d7dgROH/730YBLtiZmEdGPkFnhX4kxmjVe2xgPfCtrRd6GHRtEh9zsL8xVe+pwSzj+OtwvletZZ/wLeKD71L+ZeHHWZ/gowABkp7AwwnEjFAAAAAElFTkSuQmCC);
      /* linear-gradient(90deg, rgba(166,0,0,1) 0%, rgba(166,0,0,1) 50%, rgba(166,0,0,0) 80%, rgba(166,0,0,0) 100%); */
    background-position: top right;
    background-repeat: no-repeat;
  }

  /* https://cssgradient.io/ */
  input:valid {
    /* color: white; */
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAepJREFUeNrEk79PFEEUx9/uDDd7v/AAQQnEQokmJCRGwc7/QeM/YGVxsZJQYI/EhCChICYmUJigNBSGzobQaI5SaYRw6imne0d2D/bYmZ3dGd+YQKEHYiyc5GUyb3Y+77vfeWNpreFfhvXfAWAAJtbKi7dff1rWK9vPHx3mThP2Iaipk5EzTg8Qmru38H7izmkFHAF4WH1R52654PR0Oamzj2dKxYt/Bbg1OPZuY3d9aU82VGem/5LtnJscLxWzfzRxaWNqWJP0XUadIbSzu5DuvUJpzq7sfYBKsP1GJeLB+PWpt8cCXm4+2+zLXx4guKiLXWA2Nc5ChOuacMEPv20FkT+dIawyenVi5VcAbcigWzXLeNiDRCdwId0LFm5IUMBIBgrp8wOEsFlfeCGm23/zoBZWn9a4C314A1nCoM1OAVccuGyCkPs/P+pIdVIOkG9pIh6YlyqCrwhRKD3GygK9PUBImIQQxRi4b2O+JcCLg8+e8NZiLVEygwCrWpYF0jQJziYU/ho2TUuCPTn8hHcQNuZy1/94sAMOzQHDeqaij7Cd8Dt8CatGhX3iWxgtFW/m29pnUjR7TSQcRCIAVW1FSr6KAVYdi+5Pj8yunviYHq7f72po3Y9dbi7CxzDO1+duzCXH9cEPAQYAhJELY/AqBtwAAAAASUVORK5CYII=);
    /* linear-gradient(90deg, rgba(19,99,0,1) 0%, rgba(19,99,0,1) 50%, rgba(19,99,0,0) 80%, rgba(19,99,0,0) 100%); */
    background-position: top right;
    background-repeat: no-repeat;
  }

  input:focus:invalid {
    box-shadow: none;
  }

  .main {
    padding: 0.5rem;
    border: 2px dotted;
    border-color: transparent;
  }

  .main[open] {
    border-color: gainsboro;
  }

  details summary::marker {
    content: none;
  }

  .logo {
    height: 2rem;
  }

  .advanced::after,
  .logo::after {
    content: "\25b6";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition-duration: .5s;
  }

  @media (prefers-reduced-motion) {
        .advanced::after,
        .logo::after {
        transition-duration: 0;
      }
  }

  details[open] > .advanced::after,
  details[open] .logo::after {
    transform: rotateZ(90deg);
    transform-origin: 75% 35%;
  }

  details summary {
    cursor: pointer;
    position: relative;
  }

  details summary > * {
    display: inline-block;
  }

  summary {
    font-size: 1.5em;
  }

  summary img {
    height: 100%;
    aspect-ratio: 1/1;
  }
</style>
