<template lang="pug">
.settings(v-if="widget")
  .form-group
    label Table

    select.form-control.form-control-sm.rounded-0(v-model="form.table", @change="$emit('request', 'getColumns', form.table)")
      option(v-for="table in tables", :value="table") {{ table }}

  .form-group
    label Filters
    filters(:filters="filters", :columns="columns")

  .form-group
    label Conditions
    conditions(:rules="rules", :level="0", :columns="columns")
</template>

<script>
import conditions from './components/conditions.vue'
import filters from './components/filters.vue'

export default {
  name: 'tabledata-settings',
  props: ['widget', 'project', 'saving', 'form'],
  components: {
    conditions,
    filters
  },
  data () {
    return {
      tables: [],
      columns: [],

      rules: [],
      filters: [],

      loadingTables: false,
      loadingColumns: false,

      selectedTable: ''
    }
  },

  created () {
    this.$on('response', this.response)

    this.form.table = this.widget.meta.table

    this.rules = this.widget.meta.rules ? JSON.parse(this.widget.meta.rules) : []
    this.form.rules = this.rules

    this.filters = this.widget.meta.filters ? JSON.parse(this.widget.meta.filters) : []
    this.form.filters = this.filters

    this.loadingTables = true

    this.$emit('request', 'getTables')
  },

  methods: {
    response (type, ...value) {
      if (this[type]) {
        this[type](...value)
      }
    },

    getTables (tables) {
      this.tables = tables

      this.loadingTables = false

      this.loadingColumns = true

      this.$emit('request', 'getColumns', this.form.table || this.tables[0])
    },

    getColumns (columns) {
      this.columns = columns

      this.loadingColumns = false
    }
  }
}
</script>
