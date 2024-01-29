<script>
// inline svg
// import svg from '/assets/icon.svg'
// import LogoImage from "@/assets/logo.svg?inline"
import svg from '/assets/icon.svg?inline'

export default {
  name: 'Logo',
  data() {
    return {
      svg,
    }
  },
}
</script>

<template>
  <img :src="svg" alt="logo">
</template>
