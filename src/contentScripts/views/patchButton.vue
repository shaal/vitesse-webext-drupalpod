<template>
  <button ref="hello" class="testing" @click="this.myToggle">
    <pixelarticons-power />
  </button>
</template>

<script lang="ts">
export default {
  name: 'Test',
  data() {
    return {
      counter: 0,
    }
  },
  methods: {
    myToggle() {
      console.log(this.$refs.hello.parentNode.parentNode.host.nextElementSibling.querySelector('a').href)
    },
  },
}
</script>

<style scoped>
  .testing {
    background-color: red;
  }
</style>
