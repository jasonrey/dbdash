<template lang="pug">
#login.container.pt-2
  .row.justify-content-center.align-items-center
    form.card.card-body.bg-light.rounded-0.col-sm-8.col-md-6(@submit.prevent="submit")
      .alert.alert-warning(v-show="error") {{ error }}
      .form-group
        input.form-control.rounded-0(placeholder="Email", v-model="email")
      .form-group
        input.form-control.rounded-0(type="password", placeholder="Password", v-model="password")
      hr
      .text-right
        router-link.btn.btn-link(to="/register") Register
        button.btn.btn-info.rounded-0(type="submit", :disabled="loading") Login
</template>

<style lang="sass">
body[data-path="/login"]
  height: 100%

  #app,
  #login
    height: 100%
</style>

<script>
import api from '../library/api.js'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',

      error: '',

      loading: false
    }
  },
  methods: {
    submit () {
      if (!this.email.trim()
        || !this.password.trim()
      ) {
        return
      }

      this.loading = true

      api.post('user/login', {
        email: this.email,
        password: this.password
      })
        .then(res => {
          window.localStorage.setItem('authtoken', res.token)

          this.$router.push(this.$route.query.redirect || '/projects')
        })
        .catch(res => {
          console.log(res)
          this.error = res.message
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
