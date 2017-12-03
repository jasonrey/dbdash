<template lang="pug">
.settings(v-if="widget")
  .form-group
    label Table

    select.form-control.rounded-0(v-model="form.table")
      option(v-for="table in tables", :value="table") {{ table }}
</template>

<script>
export default {
  name: 'tabledata-settings',
  props: ['widget', 'project', 'saving', 'form'],
  data () {
    return {
      tables: [],

      loadingTables: false,

      selectedTable: '',
    }
  },

  created () {
    this.$on('response', this.response)

    this.form.table = this.widget.meta.table

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
    }
  }
}
</script>
