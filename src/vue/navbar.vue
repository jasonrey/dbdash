<template lang="pug">
nav.navbar.navbar-light.bg-light.fixed-top
  span.navbar-brand.mb-0.h1 Project Name
  button.btn.btn-link.text-dark.p-0(@click="showMobileNav = !showMobileNav")
    svg(viewBox="0 0 30 30", width="30", height="30", focusable="false")
      title Menu
      path(stroke="currentColor", stroke-width="2", stroke-linecap="round", stroke-miterlimit="10", d="M4 7h22M4 15h22M4 23h22")

  .collapse.navbar-collapse(:class="{ show: showMobileNav }")
    router-view
</template>

<script>
export default {
  watch: {
    '$route' () {
      this.showMobileNav = false
    }
  },
  data () {
    return {
      showMobileNav: false
    }
  }
}
</script>
