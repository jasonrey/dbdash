<template lang="pug">
.settings(v-if="widget")
  .form-group
    label Header
    input.form-control.form-control-sm(v-model="form.header")

  .form-group
    label Footer
    input.form-control.form-control-sm(v-model="form.footer")

  .row
    .form-group.col
      label Pre-text
      input.form-control.form-control-sm(v-model="form.pre")

    .form-group.col
      label Post-text
      input.form-control.form-control-sm(v-model="form.post")

  label.d-block Query

  .row.mb-3
    .col-auto
      label.badge.badge-secondary.rounded-0 SELECT

    .col-auto.p-0
      select.form-control.form-control-sm.rounded-0(v-model="form.type")
        option(value="count") Count
        option(value="countDistinct") Count Distinct
        option(value="sum") Sum
        option(value="min") Min
        option(value="max") Max
        option(value="avg") Average

    .col-auto
      select.form-control.form-control-sm.rounded-0(v-model="form.column")
        option(v-for="column in columns", :value="column.name") {{ column.name }}

    .col-auto.p-0
      label.badge.badge-secondary.rounded-0 FROM

    .col-auto
      select.form-control.form-control-sm.rounded-0(v-model="form.table", @change="$emit('request', 'getColumns', form.table)")
        option(v-for="table in tables", :value="table") {{ table }}

  .form-group
    conditions(:rules="rules", :level="0", :columns="columns")
</template>

<script>
import conditions from './components/conditions.vue'

export default {
  name: 'number-settings',
  props: ['widget', 'project', 'saving', 'form'],
  components: {
    conditions
  },
  data () {
    return {
      tables: [],
      columns: [],

      rules: [],

      loadingTables: false,
      loadingColumns: false,

      selectedTable: '',
    }
  },

  created () {
    this.$on('response', this.response)

    this.rules = this.widget.meta.rules ? JSON.parse(this.widget.meta.rules) : []

    this.form.rules = this.rules

    this.form.table = this.widget.meta.table
    this.form.column = this.widget.meta.column
    this.form.pre = this.widget.meta.pre
    this.form.post = this.widget.meta.post
    this.form.header = this.widget.meta.header
    this.form.footer = this.widget.meta.footer
    this.form.type = this.widget.meta.type || 'count'

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
