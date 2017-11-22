<template lang="pug">
div
  p(v-for="widget in widgets", :key="widget.id") {{ widget.id }}
</template>

<script>
import api from '../library/api'

export default {
  props: ['dashboardId'],
  data () {
    return {
      dashboard: null,
      widgets: []
    }
  },
  created () {
    api.get(`dashboard/${this.dashboardId}`)
      .then(res => {
        this.dashboard = res
      })

    api.get(`dashboard/${this.dashboardId}/widgets`)
      .then(res => {
        this.widgets = res
      })
  }
}
</script>
