<template lang="pug">
.filters
  table.table.table-condensed.mb-1
    thead
      tr
        th Type
        th Column
        th size

    tbody
      tr(
        v-for="filter in filters"
        is="filter"
        :key="filter.id"
        :filter="filter"
      )

  .action.mt-3
    button.btn.btn-sm.btn-info.rounded-0(type="button", @click="add") + Filter

</template>

<script>
import filter from './filter.vue'

export default {
  name: 'filters',
  props: ['filters', 'columns'],
  components: {
    filter
  },
  methods: {
    add () {
      this.filters.push({
        id: `filter-${Math.random()}`,
        type: '',
        column: '',
        size: 12
      })
    }
  }
}
</script>
