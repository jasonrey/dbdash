import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '../vue/login.vue'
import register from '../vue/register.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: login
    },
    {
      path: '/register',
      component: register
    }
  ]
})

const app = new Vue({
  el: '#app',
  router,
  created () {
    this.$router.push('/login')
  }
})

export default app
