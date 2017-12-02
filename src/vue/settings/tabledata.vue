<template lang="pug">
form(@submit.prevent="submit", v-if="widget")
  .form-group
    label Table

    select.form-control.rounded-0(v-model="selectedTable", @change="loadColumns")
      option(v-for="table in tables", :value="table") {{ table }}

  .form-group
    label Column

    select.form-control.rounded-0(v-model="selectedColumn")
      option(v-for="(columnMeta, column) in columns", :value="column") {{ column }}

  hr

  .form-group.text-right
    button.btn.btn-light.rounded-0(type="button", @click="$emit('back')", :disabled="saving")
      svg(width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        line(x1="18" y1="6" x2="6" y2="18")
        line(x1="6" y1="6" x2="18" y2="18")


    button.btn.btn-success.rounded-0(:disabled="saving")
      svg(width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        polyline(points="20 6 9 17 4 12")
</template>

<script>
import bridge from '../../library/bridge'
import api from '../../library/api'

export default {
  name: 'tabledata-settings',
  props: ['widget', 'project'],
  data () {
    return {
      tables: [],
      columns: {},

      saving: false,

      loadingTables: false,
      loadingColumns: false,

      selectedTable: '',
      selectedColumn: ''
    }
  },

  created () {
    this.selectedTable = this.widget.meta.table

    return Promise.resolve()
      .then(() => this.loadTables())
      // .then(() => this.loadColumns())
  },

  methods: {
    loadTables () {
      this.loadingTables = true

      return bridge(this.project)
        .get('tables')
        .then(res => {
          this.tables = res

          return this.$nextTick()
        })
        .then(() => {
          this.loadingTables = false
        })
    },

    loadColumns () {
      this.loadingColumns = true

      return bridge(this.project)
        .get(`table/${this.selectedTable}/columns`)
        .then(res => {
          this.columns = res

          return this.$nextTick()
        })
        .then(() => {
          this.selectedColumn = this.selectedColumn || Object.keys(this.columns)[0]

          this.loadingColumns = false
        })
    },

    submit () {
      this.saving = true

      api.post(`widget/${this.widget.id}`, {
        table: this.selectedTable
      })
        .then(() => {
          this.saving = false

          this.$emit('back')
        })
    }
  }
}
</script>
