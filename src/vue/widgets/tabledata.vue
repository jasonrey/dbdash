<template lang="pug">
.tabledata.d-flex.flex-column
  .alert.alert-warning.m-0(v-if="error === 'missing-table'") No table configured.
    =" "
    router-link.alert-link(:to="`/project/${$route.params.projectId}/dashboard/${$route.params.dashboardId}/widget/${widget.id}/settings`") Configure this widget.

  .filters.row(v-show="!error")
    .filter(
      v-for="filter in filters"
      :class="'col-' + filter.size"
      :is="filter.type"
      :key="filter.id"
      :filter="filter"
      @change="change"
    )

  .col.w-100.h-100(v-show="!error", ref="table")
    .position-absolute.top-0.left-0.w-100.overflow-hidden(v-if="columns.length && records.length")
      table.table.table-striped.table-hover.table-sm.table-responsive.table-bordered.m-0(:style="{ transform: 'translateX(-' + tableBodyLeft + 'px)' }")
        thead.thead-light
          tr
            th(v-for="column in columns", :key="column.name") {{ column.name }}

    .position-absolute.top-0.left-0.bottom-0.w-100.overflow-auto(:style="{ top: tableBodyTop + 'px' }", @scroll="scrollTableBody", v-if="columns.length && records.length")
      table.table.table-striped.table-hover.table-sm.table-responsive.table-bordered.m-0
        tbody
          tr(v-for="record in records", :key="record._tablekey", :data-key="record._tablekey")
            td(v-for="column in columns", :key="record._tablekey + column.name", :data-key="record._tablekey + '-' + column.name") {{ record[column.name] }}

    .overlay.d-flex.align-items-center.justify-content-center.text-white(v-if="loading") Loading
    .d-flex.justify-content-center.align-items-center.alert.alert-warning.h-100(v-if="!loading && (!columns.length || !records.length)") No data.

  .row.mt-2.mx-0(v-if="!error")
    .col

    button.btn.btn-sm.btn-link.d-flex.align-items-center.mr-3(type="button", @click="loadTable")
      svg(width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        polyline(points="23 4 23 10 17 10")
        polyline(points="1 20 1 14 7 14")
        path(d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15")

    .small.my-auto Total: {{ total }}

    .form-group.mx-3.my-0.row
      label.small.my-auto Limit:
      select.form-control-sm.ml-2.col(v-model.number="limit", @change="init")
        option(value="10") 10
        option(value="20") 20
        option(value="30") 30
        option(value="50") 50
        option(value="100") 100

    .row.mx-0
      button.btn.btn-sm.btn-light.rounded-0.border(@click="prev")
        svg(width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
          polyline(points="15 18 9 12 15 6")
      .d-flex.align-items-center.px-3.small.bg-light.border.border-left-0.border-right-0 {{ page }} / {{ maxPages }}
      button.btn.btn-sm.btn-light.rounded-0.border(@click="next")
        svg(width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
          polyline(points="9 18 15 12 9 6")

</template>

<script>
import api from '../../library/api'
import bridge from '../../library/bridge'

import datepicker from './tabledata/datepicker.vue'

export default {
  name: 'tabledata-widget',
  props: ['widget', 'project'],
  components: {
    datepicker
  },
  computed: {
    maxPages () {
      return Math.ceil(this.total / this.limit)
    },

    offset () {
      return (this.page - 1) * this.limit
    }
  },
  data () {
    return {
      error: '',

      total: 0,

      limit: 10,
      sort: '',
      order: '',
      page: 1,

      primary: [],
      columns: [],
      records: [],

      filters: [],

      tableBodyTop: 0,
      tableBodyLeft: 0,

      paginationThrottle: null,

      loading: false
    }
  },
  created () {
    this.init()
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'widgetSettings' && parseInt(from.params.widgetId) === this.widget.id) {
        this.getWidget()
          .then(() => this.refreshTable())
      }
    }
  },
  methods: {
    init () {
      this.error = ''

      if (!this.widget.meta.table) {
        this.error = 'missing-table'
        return
      }

      this.filters = JSON.parse(this.widget.meta.filters || [])

      return this.refreshTable()
    },

    getWidget () {
      return api(`widget/${this.widget.id}`)
        .then(res => {
          this.widget.meta = res.meta
        })
    },

    reset () {
      this.columns = []
      this.primary = []
      this.records = []
      this.tableBodyTop = 0
      this.tableBodyLeft = 0
      this.total = 0
      this.page = 1

      return this.$nextTick()
    },

    refreshTable () {
      return Promise.resolve()
        .then(() => this.reset())
        .then(() => this.loadTable())
        .then(() => this.reflowTable())
    },

    loadTable () {
      this.loading = true

      return this.$nextTick()
        .then(() => bridge(this.project).get(`table/${this.widget.meta.table}/columns`))
        .then(res => {
          this.columns = res

          this.primary = this.columns.filter(column => column.primary)
        })
        .then(() => this.getTotal())
        .then(() => this.getData())
        .then(() => this.$nextTick())
        .then(() => this.reflowTable())
        .then(() => {
          this.loading = false
        })
    },

    reflowTable () {
      return Promise.resolve()
        .then(() => {
          const thead = this.$refs.table.querySelector('thead')

          this.tableBodyTop = thead ? thead.offsetHeight : 0

          const ths = [...this.$refs.table.querySelectorAll('thead th')]
          const tds = [...this.$refs.table.querySelectorAll('tbody tr td')].slice(0, ths.length)

          ths.map(th => th.style.width = 'auto')
          tds.map(td => td.style.width = 'auto')

          return this.$nextTick()
            .then(() => ({
              ths, tds
            }))
        })
        .then(({ths, tds}) => ({
          ths,
          tds,
          widths: ths.map((el, index) => Math.max(el.offsetWidth, tds[index] ? tds[index].offsetWidth : 0))
        }))
        .then(({ths, tds, widths}) => {
          const sum = widths.reduce((total, width) => total += width, 0)

          ;[...this.$refs.table.querySelectorAll('table')].map(el => el.style.width = sum + 'px')

          widths.map((width, index) => {
            ths[index].style.width = width + 'px'

            if (tds[index]) {
              tds[index].style.width = width + 'px'
            }
          })

          return this.$nextTick()
        })
    },

    getTotal () {
      return bridge(this.project).post(`table/${this.widget.meta.table}/aggregate`, {
        rules: this.widget.meta.rules,
        aggregate: 'count',
        filters: this.filters.filter(item => item.value !== undefined && item.value !== null)
      })
        .then(res => {
          this.total = res.total
        })
    },

    getData () {
      return bridge(this.project).post(`table/${this.widget.meta.table}/records`, {
        rules: this.widget.meta.rules,
        limit: this.limit,
        offset: this.offset,
        filters: this.filters.filter(item => item.value !== undefined && item.value !== null)
      })
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
    },

    prev () {
      clearTimeout(this.paginationThrottle)

      this.page = Math.max(1, this.page - 1)

      this.loading = true

      this.paginationThrottle = setTimeout(() => {
        this.loadTable()
      }, 500)
    },

    next () {
      clearTimeout(this.paginationThrottle)

      this.page = Math.min(this.maxPages, this.page + 1)

      this.loading = true

      this.paginationThrottle = setTimeout(() => {
        this.loadTable()
      }, 500)
    },

    change (filter, event) {
      this.refreshTable()
    }
  }
}
</script>

<style lang="sass" scoped>
table
  font-size: 12px
  width: auto
  max-width: initial

  th,
  td
    padding: 4px 8px
</style>
