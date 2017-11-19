<template lang="pug">
#project
  .row.no-gutters
    #sidebar.col-12.col-md-3.col-xl-2.border.border-top-0.border-left-0.border-bottom-0
      nav
        router-link.d-block.p-3(to="/dashboard/1") Dashboard
        router-link.d-block.p-3(to="/dashboard/1") Dashboard
        router-link.d-block.p-3(to="/dashboard/1") Dashboard
        router-link.d-block.p-3(to="/dashboard/1") Dashboard

    #dashboard.col-12.col-md-9.col-xl-10.p-3
      p test
</template>

<style lang="sass">
body[data-path^="/project/"]
  height: 100%

  #app,
  #project
    height: 100%

#project
  .row
    @media (min-width: 768px)
      height: 100%

#sidebar,
#dashboard
  overflow-y: auto

#sidebar
  a
    &:hover
      background-color: rgba(0, 0, 0, 0.1)

</style>


<script>
import api from '../library/api.js'

export default {
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
