<template lang="pug">
#login.row.justify-content-center.align-items-center
  .col-sm-8.col-md-6
    form(@submit.prevent="login")
      .form-group
        input.form-control(placeholder="Email", v-model="email")
      .form-group
        input.form-control(type="password", placeholder="Password", v-model="password")
      hr
      .text-right
        router-link.btn.btn-link(to="/register") Register
        button.btn.btn-info(type="submit") Login
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
    }
  }
}
</script>
