import Vue from 'vue'
import VueRouter from 'vue-router'

import api from '../library/api.js'

import login from '../vue/login.vue'
import register from '../vue/register.vue'
import projects from '../vue/projects.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/projects',
      component: projects
    },
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
  name: 'App',
  router,
  created () {
    if (this.$route.path === '/') {
      api.get('user')
        .then(() => {
          this.$router.push('/projects')
        })
        .catch(() => {
          this.$router.push('/login')
        })
    }
  },
  methods: {
    authorize () {
      api.get('user')
        .catch(() => {
          this.$router.push('/login')
        })
    }
  }
})

export default app
