<template lang="pug">
#register.container.pt-2
  .row.justify-content-center.align-items-center
    form.card.card-body.bg-light.rounded-0.col-sm-8.col-md-6(@submit.prevent="submit")
      .alert.alert-warning(v-show="error") {{ error }}
      .form-group
        input.form-control.rounded-0(placeholder="Email", v-model="email")
      .form-group
        input.form-control.rounded-0(type="password", placeholder="Password", v-model="password")
      .form-group
        input.form-control.rounded-0(type="password", placeholder="Confirm Password", v-model="confirmpassword")
      hr
      .text-right
        router-link.btn.btn-link(to="/login") Login
        button.btn.btn-info.rounded-0(type="submit", :disabled="loading") Register
</template>

<style lang="sass">
body[data-path="/register"]
  height: 100%

  #app,
  #register
    height: 100%
</style>

<script>
import api from '../library/api.js'

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      confirmpassword: '',

      error: '',

      loading: false
    }
  },
  methods: {
    submit () {
      if (this.password !== this.confirmpassword
        || !this.email.trim()
        || !this.password.trim()
      ) {
        return
      }

      this.loading = true

      api.post('user/register', {
        email: this.email,
        password: this.password
      })
        .then(res => {
          window.localStorage.setItem('authtoken', res.token)

          this.$router.push('/projects')
        })
        .catch(res => {
          this.error = res.message
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
