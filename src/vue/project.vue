<template lang="pug">
#project
  .row.no-gutters
    #sidebar.col-12.col-md-3.col-xl-2.border.border-top-0.border-left-0.border-bottom-0.d-flex.flex-column
      nav
        router-link.d-block.p-2(:to="`/project/${projectId}/dashboard/${dashboard.id}`", active-class="bg-info text-white", v-for="dashboard in dashboards", :key="dashboard.id") {{ dashboard.name }}
      .row.border.border-left-0.border-right-0.border-bottom-0
        .col-6.p-0
          button.btn.btn-block +
        .col-6.p-0
          button.btn.btn-block #

    #dashboard.col-12.col-md-9.col-xl-10.p-3
      router-view(name="dashboard")
</template>

<style lang="sass">
body[data-path^="/project/"]
  height: 100%

  #app,
  #project
    height: 100%

#project
  > .row
    @media (min-width: 768px)
      height: 100%

#dashboard
  overflow-y: auto

#sidebar
  overflow: hidden

  nav
    overflow: auto
    flex-grow: 1

  a
    &:hover
      background-color: rgba(0, 0, 0, 0.1)

</style>


<script>
import api from '../library/api.js'

export default {
  name: 'project',
  props: ['projectId'],
  data () {
    return {
      project: null,
      dashboards: []
    }
  },
  created () {
    api.get(`project/${this.projectId}`)
      .then(res => {
        this.project = res
      })

    api.get(`project/${this.projectId}/dashboards`)
      .then(res => {
        this.dashboards = res
      })
  },
  methods: {

  }
}
</script>
