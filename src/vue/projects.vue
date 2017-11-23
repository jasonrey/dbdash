<template lang="pug">
#projects.container.pt-2
  .card.rounded-0
    form.card-body(@submit.prevent="submit")
      .alert.alert-warning(v-show="error") {{ error }}
      h4.card-title New Project
      .form-group
        .input-group
          input.form-control.rounded-0(placeholder="New Project Name", :disabled="loading", v-model="name")
          button.input-group-addon.bg-success.text-white.rounded-0(:disabled="loading || !name.trim()") Create
  hr
  p.text-center.my-2(v-if="!projects.length")
    span(v-if="loadingProjects") Loading projects...
    span(v-else) No projects yet.
  .row
    router-link.col-sm-6.col-md-4.col-lg-3.my-2(v-if="projects.length", v-for="project in projects", :key="project.id", :to="`/project/${project.id}`")
      .card.bg-light.rounded-0
        .card-body
          .card-title {{ project.name }}
          .card-text
            span.badge.badge-info {{ project.role }}
</template>

<script>
import api from '../library/api.js'

export default {
  name: 'Projects',
  data () {
    return {
      name: '',
      projects: [],

      error: '',

      loadingProjects: true,
      loading: false
    }
  },
  created () {
    api('projects')
      .then(res => {
        this.loadingProjects = false
        this.projects = res
      })
  },
  methods: {
    submit () {
      this.error = ''

      if (!this.name.trim()) {
        return
      }

      this.loading = true

      api.put('project', {
        name: this.name
      })
        .then(res => {
          this.projects.unshift(res)
        })
        .catch(res => {
          this.error = res.message
        })
        .then(() => {
          this.loading = false
          this.name = ''
        })
    }
  }
}
</script>
