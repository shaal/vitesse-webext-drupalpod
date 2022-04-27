<template>
  <button ref="hello" class="testing" @click="myToggle">
    <!-- <pixelarticons-power /> -->
    <!-- Display logo component -->
    <Logo />
  </button>
</template>

<script>
// import Logo from './Logo.vue'
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
