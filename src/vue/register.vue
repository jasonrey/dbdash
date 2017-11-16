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
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmpassword: ''
    }
  },
  methods: {
    register() {
    }
  }
}
</script>
