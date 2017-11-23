<template lang="pug">
#dashboard
  #widgets(v-show="tab === 'widgets' || !tab")
    p(v-for="widget in widgets", :key="widget.id") {{ widget.id }}
  #settings(v-if="tab === 'settings'")
    form(@submit.prevent="submit")
      .form-group
        label Name
        input.form-control(v-model="dashboard.name")

      .form-group.text-right
        button.btn.btn-success Save

  button#settings-button.btn.btn-primary.rounded-circle.p-0(@click="tab = 'settings'", v-show="tab !== 'settings'")
    svg(xmlns="http://www.w3.org/2000/svg", width="24", height="24", viewbox="0 0 24 24", fill="none", stroke="currentColor", stroke-width="2", stroke-linecap="round", stroke-linejoin="round")
      circle(cx="12", cy="12", r="3")
      path(d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z")

</template>

<script>
import api from '../library/api'

export default {
  props: ['dashboardId'],
  data () {
    return {
      dashboard: {},
      widgets: [],

      tab: 'widgets'
    }
  },
  watch: {
    '$route' (to, from) {
      this.initDashboard()
    }
  },
  created () {
    this.initDashboard()
  },
  methods: {
    initDashboard () {
      this.tab = 'widgets'

      return Promise.all([
        api.get(`dashboard/${this.dashboardId}`)
          .then(res => {
            this.dashboard = res
          }),

        api.get(`dashboard/${this.dashboardId}/widgets`)
          .then(res => {
            this.widgets = res
          })
      ])
    },

    submit () {
      api.post(`dashboard/${this.dashboardId}`, {
        name: this.dashboard.name
      })

      this.$emit('updateDashboardName', this.dashboard.id, this.dashboard.name)
    }
  }
}
</script>

<style lang="sass">
#dashboard
  overflow-y: auto

#settings-button
  position: absolute
  bottom: 10px
  right: 10px
  width: 50px
  height: 50px

  svg
    position: absolute
    top: 12px
    left: 12px
</style>
