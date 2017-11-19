<template lang="pug">
ul.navbar-nav.my-lg-0
  li.nav-item.dropdown
    button.btn.btn-link.btn-block.text-left.nav-link.dropdown-toggle.border-0(@click="showNav = !showNav")
    .dropdown-menu.dropdown-menu-right(:class="{ show: showNav }")
      button.btn.btn-link.btn-block.text-left.dropdown-item(@click="logout") Logout
</template>

<script>
export default {
  data () {
    return {
      showNav: false
    }
  },

  methods: {
    logout () {
      this.showMobileNav = false

      window.localStorage.removeItem('authtoken')

      this.$router.push('/login')
    }
  }
}
</script>
