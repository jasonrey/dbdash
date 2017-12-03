<template lang="pug">
.settings(v-if="widget")
  .form-group
    label Header
    input.form-control(v-model="form.header")

  .form-group
    label Footer
    input.form-control(v-model="form.footer")

  .form-group
    label Pre-text
    input.form-control(v-model="form.pre")

  .form-group
    label Post-text
    input.form-control(v-model="form.post")

  .form-group
    label Table

    select.form-control.rounded-0(v-model="form.table")
      option(v-for="table in tables", :value="table") {{ table }}
</template>

<script>
export default {
  name: 'number-settings',
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
    this.form.pre = this.widget.meta.pre
    this.form.post = this.widget.meta.post
    this.form.header = this.widget.meta.header
    this.form.footer = this.widget.meta.footer

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
