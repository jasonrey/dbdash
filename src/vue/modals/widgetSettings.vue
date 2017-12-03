<template lang="pug">
.modal.w-100.h-100.d-block.position-absolute.top-0.left-0
  .overlay(@click="close")

  .modal-dialog.modal-lg.my-0.py-3.overflow-auto.d-flex.flex-column.justify-content-center.h-100
    form.modal-content.rounded-0(@submit.prevent="submit")
      .modal-header
        h5.modal-title(v-if="widget") {{ '#' + widgetId }}: {{ widget.name }}
        button.close(type="button", @click="close")
          img(src="images/x.svg")
      .modal-body.overflow-auto.pb-0
        div(
          ref="settings"
          v-if="widget"
          :is="widget.type"
          :widget="widget"
          :project="project"
          :saving="saving"
          :form="form"
          @back="close"
          @request="request"
        )
      .modal-footer
        .form-group.text-right.mb-0
          button.btn.btn-secondary.btn-sm.rounded-0(type="button", @click="close", :disabled="saving")
            svg(width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
              line(x1="18" y1="6" x2="6" y2="18")
              line(x1="6" y1="6" x2="18" y2="18")

          button.btn.btn-success.btn-sm.rounded-0(:disabled="saving")
            svg(width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
              polyline(points="20 6 9 17 4 12")
</template>

<script>
import api from '../../library/api'
import bridge from '../../library/bridge'

import tabledata from '../settings/tabledata.vue'
import number from '../settings/number.vue'

export default {
  name: 'widget-settings',
  props: ['widgetId', 'project'],
  components: {
    tabledata,
    number
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
      widget: null,

      saving: false,

      form: {}
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

    request (type, ...value) {
      if (this[type]) {
        this[type](...value)
          .then(res => {
            this.$refs.settings.$emit('response', type, res)
          })
      }
    },

    getTables () {
      return bridge(this.project)
        .get('tables')
    },

    getColumns (table) {
      return bridge(this.project)
        .get(`table/${table}/columns`)
    },

    submit () {
      this.saving = true

      return api.post(`widget/${this.widget.id}`, this.form)
        .then(res => {
          this.saving = false

          this.close()

          return res
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.modal
  z-index: 1050

.modal-dialog
  max-height: 100%
</style>
