<template lang="pug">
div.modal.w-100.h-100.d-block
  .overlay.w-100.h-100(@click="close")

  .modal-dialog
    .modal-content.rounded-0
      .modal-header
        h5.modal-title Widget Settings
        button.close(type="button", @click="close")
          img(src="images/x.svg")
      .modal-body
        form(@submit.prevent="submit", v-if="widget")
          div(:is="widget.type", :widget="widget", :project="project")
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
    },

    submit () {

    }
  }
}
</script>

<style lang="sass">
.modal
  position: absolute
  top: 0
  left: 0
  z-index: 1050

.overlay
  position: absolute
  top: 0
  left: 0
  background-color: rgba(0, 0, 0, 0.8)
</style>
