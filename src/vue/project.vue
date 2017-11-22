<template lang="pug">
#project
  .row.no-gutters
    #sidebar.col-12.col-md-3.col-xl-2.border.border-top-0.border-left-0.border-bottom-0.d-flex.flex-column
      nav
        router-link.d-block.p-2(:to="`/project/${projectId}/dashboard/${dashboard.id}`", active-class="bg-info text-white", v-for="dashboard in dashboards", :key="dashboard.id") {{ dashboard.name }}
        form(@submit.prevent="saveNewDashboard")
          .input-group.p-2(v-show="showNewDashboardInput")
            input.form-control(placeholder="New Dashboard", v-model="newDashboardName", ref="newDashboardInput", @keyup.esc="showNewDashboardInput = false")
            button.input-group-addon OK
      .row.border.border-left-0.border-right-0.border-bottom-0
        .col-6.p-0
          button.btn.btn-block(@click="addDashboard") +
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
      dashboards: [],

      showNewDashboardInput: false,
      newDashboardName: '',

      savingNewDashboard: false
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
    addDashboard () {
      this.showNewDashboardInput = true
      this.newDashboardName = ''

      this.$nextTick()
        .then(() => {
          this.$refs.newDashboardInput.focus()
        })
    },

    saveNewDashboard () {
      if (!this.newDashboardName.trim()) {
        return
      }

      this.savingNewDashboard = true

      api.put(`project/${this.projectId}/dashboard`, {
        name: this.newDashboardName
      })
        .then(res => {
          this.dashboards.push(res)

          this.newDashboardName = ''
          this.savingNewDashboard = false
          this.showNewDashboardInput = false

          this.$router.push(`/project/${this.projectId}/dashboard/${res.id}`)
        })
    }
  }
}
</script>
