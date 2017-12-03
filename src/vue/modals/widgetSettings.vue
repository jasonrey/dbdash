<template lang="pug">
.modal.w-100.h-100.d-block.position-absolute.top-0.left-0
  .overlay(@click="close")

  .modal-dialog
    .modal-content.rounded-0
      .modal-header
        h5.modal-title(v-if="widget") Widget {{ widgetId }}: {{ widget.name }}
        button.close(type="button", @click="close")
          img(src="images/x.svg")
      .modal-body
        div(v-if="widget", :is="widget.type", :widget="widget", :project="project", @back="close")
</template>

<script>
import api from '../../library/api'

import tabledata from '../settings/tabledata.vue'

export default {
  name: 'widget-settings',
  props: ['widgetId', 'project'],
  components: {
    tabledata
  },
  watch: {
    '$route' (to, from) {
      this.initWidgetSettings()
    }
  },
  created () {
    this.initWidgetSettings()
  },
  data () {
    return {
      widget: null
    }
  },
  methods: {
    initWidgetSettings () {
      api(`widget/${this.widgetId}`)
        .then(res => {
          this.widget = res
        })
    },

    close () {
      this.$router.push(`/project/${this.$route.params.projectId}/dashboard/${this.$route.params.dashboardId}`)
    }
  }
}
</script>

<style lang="sass">
.modal
  z-index: 1050
</style>
