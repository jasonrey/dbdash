<template lang="pug">
#register.row.justify-content-center.align-items-center
  .col-sm-8.col-md-6
    form(@submit.prevent="register")
      .form-group
        input.form-control(placeholder="Email", v-model="email")
      .form-group
        input.form-control(type="password", placeholder="Password", v-model="password")
      .form-group
        input.form-control(type="password", placeholder="Confirm Password", v-model="confirmpassword")
      hr
      .text-right
        router-link.btn.btn-link(to="/login") Login
        button.btn.btn-info(type="submit") Register
</template>

<script>
import api from '../library/api.js'

export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      confirmpassword: '',

      loading: false
    }
  },
  methods: {
    register() {
      console.log(this.password !== this.confirmpassword
        || !this.email.trim()
        || !this.password.trim())
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
          console.log(res)
          api.auth = res.token
        })
        .catch(() => {
        })
        .then(() => {
          this.loading = false
        })
    }
  }
}
</script>
