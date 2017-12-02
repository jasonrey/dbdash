<template lang="pug">
.tabledata
  .alert.alert-warning(v-if="error === 'missing-table'") No table configured.
    =" "
    router-link.alert-link(:to="`/project/${$route.params.projectId}/dashboard/${$route.params.dashboardId}/widget/${widget.id}/settings`") Configure this widget.

  .table-wrapper.w-100.h-100.overflow-hidden(v-show="!error", ref="table")
    .table-head-wrapper.w-100(:style="{ transform: 'translateX(-' + tableBodyLeft + 'px)' }")
      table.table.table-striped.table-hover.table-sm.table-responsive.table-bordered.m-0
        thead.thead-light
          tr
            th(v-for="column in columns", :key="column.name") {{ column.name }}
    .table-body-wrapper.w-100.overflow-auto(:style="{ top: tableBodyTop + 'px' }", @scroll="scrollTableBody")
      table.table.table-striped.table-hover.table-sm.table-responsive.table-bordered.m-0
        tbody
          tr(v-for="record in records", :key="record._tablekey", :data-key="record._tablekey")
            td(v-for="column in columns", :key="record._tablekey + column.name", :data-key="record._tablekey + '-' + column.name") {{ record[column.name] }}
</template>

<script>
import bridge from '../../library/bridge'

export default {
  name: 'tabledata-widget',
  props: ['widget', 'project'],
  data () {
    return {
      error: '',

      total: 0,

      limit: 10,
      offset: 0,
      sort: '',
      order: '',

      primary: [],
      columns: [],
      records: [],

      tableBodyTop: 0,
      tableBodyLeft: 0
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (!this.widget.meta.table) {
        this.error = 'missing-table'
        return
      }

      return Promise.resolve()
        .then(() => bridge(this.project).get(`table/${this.widget.meta.table}/columns`))
        .then(res => {
          this.columns = res

          this.primary = this.columns.filter(column => column.primary)
        })
        .then(() => this.getTotal())
        .then(() => this.getData())
        .then(() => this.$nextTick())
        .then(() => {
          this.tableBodyTop = this.$refs.table.querySelector('thead').offsetHeight

          const ths = [...this.$refs.table.querySelectorAll('thead th')]
          const tds = [...this.$refs.table.querySelectorAll('tbody tr td')].slice(0, ths.length)

          ths.map(th => th.style.width = '')
          tds.map(td => td.style.width = '')

          return this.$nextTick().then(() => ({
            ths, tds
          }))
        })
        .then(({ths, tds}) => ({
          ths,
          tds,
          widths: ths.map((el, index) => Math.max(el.offsetWidth, tds[index].offsetWidth))
        }))
        .then(({ths, tds, widths}) => {
          const sum = widths.reduce((total, width) => total += width, 0)

          ;[...this.$refs.table.querySelectorAll('table')].map(el => el.style.width = sum + 'px')

          widths.map((width, index) => {
            ths[index].style.width = width + 'px'
            tds[index].style.width = width + 'px'
          })
        })
    },

    getTotal () {
      return bridge(this.project).get(`table/${this.widget.meta.table}/records/count`)
        .then(res => {
          this.total = res.total
        })
    },

    getData () {
      const payload = encodeURIComponent(JSON.stringify({
        limit: this.limit,
        offset: this.offset
      }))

      return bridge(this.project).get(`table/${this.widget.meta.table}/records?payload=${payload}`)
        .then(res => {
          this.records = res.map(record => {
            record._tablekey = this.primary.length
              ? this.primary.reduce((tablekey, column) => {
                tablekey += record[column.name]
                return tablekey
              }, '')
              : Math.random().toString()
            return record
          })
        })
    },

    scrollTableBody (event) {
      this.tableBodyLeft = event.target.scrollLeft
    }
  }
}
</script>

<style lang="sass" scoped>
.table-wrapper
  position: absolute
  top: 0
  left: 0

.table-head-wrapper,
.table-body-wrapper
  position: absolute
  top: 0
  left: 0

.table-body-wrapper
  bottom: 0

table
  font-size: 12px
  width: auto
  max-width: initial

  th,
  td
    padding: 4px 8px
</style>
