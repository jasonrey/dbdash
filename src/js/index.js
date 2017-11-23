import Vue from 'vue'
import VueRouter from 'vue-router'

import api from '../library/api.js'

import navbar from '../vue/navbar.vue'
import index from '../vue/index.vue'
import login from '../vue/login.vue'
import register from '../vue/register.vue'
import projects from '../vue/projects.vue'
import project from '../vue/project.vue'
import dashboard from '../vue/dashboard.vue'

import userNav from '../vue/navbar/user.vue'
import projectNav from '../vue/navbar/project.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      components: { default: index, navbar },
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/login',
      name: 'login',
      components: { default: login, navbar },
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      components: { default: register, navbar },
      meta: {
        requiresGuest: true
      }
    },
    {
      path: '/projects',
      components: { default: projects, navbar },
      children: [
        {
          path: '',
          name: 'projects',
          components: {
            navs: userNav
          }
        }
      ],
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/project/:projectId',
      components: { default: project, navbar },
      props: { default: true, navbar: true },
      children: [
        {
          path: '',
          name: 'project',
          components: {
            navs: projectNav
          }
        },
        {
          path: 'settings',
          name: 'settings',
          components: {
            navs: projectNav
          }
        },
        {
          path: 'dashboard/:dashboardId',
          name: 'dashboard',
          components: {
            navs: projectNav,
            dashboard
          },
          props: { dashboard: true }
        }
      ],
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!window.localStorage.getItem('authtoken')) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }

    return api('user')
      .then(() => {
        next()
      })
      .catch(() => {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      })
  }

  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (!window.localStorage.getItem('authtoken')) {
      if (to.path === '/') {
        return next('/login')
      }

      return next()
    }

    return api('user')
      .then(() => {
        if (to.query.redirect) {
          return next(to.query.redirect)
        }

        next('/projects')
      })
      .catch(() => {
        if (to.path === '/') {
          return next('/login')
        }

        next()
      })
  }
})

const app = new Vue({
  el: '#app',
  name: 'App',
  router,
  watch: {
    '$route' (to, from) {
      document.body.dataset.path = to.path
    }
  },
  created () {
    document.body.dataset.path = this.$route.path
  }
})

export default app
