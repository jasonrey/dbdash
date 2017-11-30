<template lang="pug">
#dashboard
  div(v-for="widget in widgets", :key="widget.id", :is="widget.type") {{ widget.id }}
  button.btn.btn-info.btn-block(@click="addWidget") +

</template>

<script>
import api from '../library/api'
import empty from './widgets/empty.vue'

export default {
  props: ['dashboardId'],
  components: {
    empty
  },
  data () {
    return {
      dashboard: {},
      widgets: [],
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

    addWidget () {
      const id = 'w-' + Math.random().toString().slice(2) + Date.now().toString()
      this.widgets.push({
        type: 'empty'
      })
    }
  }
}
</script>

<style lang="sass">
#dashboard
  overflow-y: auto
</style>
