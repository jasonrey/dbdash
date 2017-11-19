<template lang="pug">
.navbar-nav.my-lg-0.text-right
  router-link.nav-item.nav-link(to="/projects") Projects
  button.btn.btn-link.nav-item.nav-link.text-right(@click="logout") Logout
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
