<template lang="pug">
#project
  .row.no-gutters(v-show="$route.name !== 'settings'")
    #sidebar.col-12.col-md-3.col-xl-2.border.border-top-0.border-left-0.border-bottom-0.d-flex.flex-column
      nav
        router-link.d-block.p-2(:to="`/project/${projectId}/dashboard/${dashboard.id}`", active-class="bg-info text-white", v-for="dashboard in dashboards", :key="dashboard.id") {{ dashboard.name }}
        form(@submit.prevent="saveNewDashboard")
          .input-group.p-2(v-show="showNewDashboardInput")
            input.form-control(placeholder="New Dashboard", v-model="newDashboardName", ref="newDashboardInput", @keyup.esc="showNewDashboardInput = false")
            button.input-group-addon OK
      .row.border.border-left-0.border-right-0.border-bottom-0.no-gutters
        .col-6.p-0
          button.btn.btn-block.btn-light.rounded-0(@click="addDashboard")
            img(src="images/plus.svg")
        .col-6.p-0
          router-link.btn.btn-block.btn-light.rounded-0(:to="`/project/${projectId}/settings`")
            img(src="images/settings.svg")

    router-view.col-12.col-md-9.col-xl-10(name="dashboard", @updateDashboardName="updateDashboardName", :project="project")
  form#project-settings.container(v-if="$route.name === 'settings'", @submit.prevent="submit")
    h3.my-3 Project Settings
    .form-group
      label Secret Key
      .input-group
        input.form-control.rounded-0(:value="project.identifier", disabled)
        button.input-group-addon.rounded-0.bg-danger.text-white(type="button", @click="resetKey") Reset Key
    hr
    .form-group
      label Bridge Endpoint
      input.form-control.rounded-0(v-model="project.meta.bridge", :class="{ 'is-invalid': !project.meta.bridge }", required)
      .invalid-feedback(v-if="!project.meta.bridge") *Required.
    .form-group.text-right
      button.btn.btn-light.mr-1.rounded-0(type="button", @click="back") Back
      button.btn.btn-success.rounded-0 Save
  router-view#modal.w-100.h-100(name="modal", :project="project")
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

#sidebar
  overflow: hidden

  nav
    overflow: auto
    flex-grow: 1

  a
    &:hover
      background-color: rgba(0, 0, 0, 0.1)

  .btn
    img
      width: 16px

</style>

<script>
import api from '../library/api.js'

export default {
  name: 'project',
  props: ['projectId'],
  data () {
    return {
      project: {
        meta: {}
      },
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

        if (!this.project.meta.bridge) {
          this.$router.push(`/project/${this.projectId}/settings`)
        }
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
    },

    updateDashboardName (id, name) {
      this.dashboards.find(dashboard => dashboard.id === id).name = name
    },

    resetKey () {
      api.post(`/project/${this.projectId}/reset`)
        .then(res => {
          this.project.identifier = res.identifier
        })
    },

    submit () {
      api.post(`/project/${this.projectId}`, {
        meta: this.project.meta
      })

      this.back()
    },

    back () {
      if (!this.project.meta.bridge || !this.project.meta.bridge.trim()) {
        return
      }

      this.$router.push(`/project/${this.projectId}`)
    }
  }
}
</script>
