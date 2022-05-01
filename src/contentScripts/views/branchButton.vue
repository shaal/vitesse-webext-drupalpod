<script>
// import Logo from './Logo.vue'
export default {
  name: 'Test',
  data() {
    return {
      drupal_core: '9.4.x',
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
  methods: {
    supportedPHPVersions(supported) {
      // loop through all PHP versions
      return this.php_versions.filter((current_php_version) => {
        // find current version in drupal_core_versions
        const drupalCore = this.drupal_core_versions.find(version => version.value === this.drupal_core)
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
  <details open>
    <summary><Logo /></summary>
    <h2>
      {{ $currentBranch }}
    </h2>
    <p>Default options to open drupalpod: </p>
    <div>
      {{ drupal_core }}
      <h1>if this page is a core issue page, choose same core by default</h1>
      <form>
        <!-- If this is core issue, mark the issue version first -->
        <label for="core-select">Choose a Drupal core version:</label>
        <select
          id="core-select" v-model="drupal_core" name="core-select"
        >
          <option v-for="version in drupal_core_versions" :value="version.value">
            {{ version.name }}
          </option>
        </select>
      </form>
    </div>
    <details open>
      <summary>Advance Options:</summary>
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
            <option v-for="version in drupal_core_versions" :value="version.value">
              {{ version.name }}
            </option>
          </datalist>

          <label for="php-version">PHP version:</label>
          <select
            id="php-version" name="php-version"
          >
            <optgroup
              :label="`Supported by ${drupal_core}`"
            >
              <option v-for="version in supportedPHPVersions(true)">
                {{ version }}
              </option>
            </optgroup>
            <optgroup
              v-if="supportedPHPVersions(false).length > 0"
              :label="`Not supported by ${drupal_core}`"
            >
              <option v-for="version in supportedPHPVersions(false)">
                {{ version }}
              </option>
            </optgroup>
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

  summary {
    font-size: 1.5em;
  }

  summary img {
    outline: 1px solid;
    outline-offset: 2px;
    border-radius: 5px;
    padding: 0 5px 0 5px;
    width: 25px;
    height: 40px;
    float: left;
    margin-right: 0.5em;
  }

/*
  summary img:hover {
    animation-name: wave-animation;
    animation-duration: 2.5s;
    animation-iteration-count: 1;
    transform-origin: 70% 70%;
  }

  @keyframes wave-animation {
    0% {
        transform: rotate( 0.0deg)
    }
    10% {
        transform: rotate(14.0deg)
    }
    20% {
        transform: rotate(-8.0deg)
    }
    30% {
        transform: rotate(14.0deg)
    }
    40% {
        transform: rotate(-4.0deg)
    }
    50% {
        transform: rotate(10.0deg)
    }
    60% {
        transform: rotate( 0.0deg)
    }
    100% {
        transform: rotate( 0.0deg)
    }
  }
*/
</style>
