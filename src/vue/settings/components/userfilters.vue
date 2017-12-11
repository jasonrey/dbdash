<template lang="pug">
.filters
  .table.table-condensed.mb-1
    .thead
      .tr
        .th.text-center.py-1.pr-3 Type
        .th.text-center.py-1.pr-3 Column
        .th.text-center.py-1.pr-3.w-1 Size
        .th.py-1 &nbsp;

    .tbody
      .tr.py-1(
        v-for="filter in filters"
        is="userfilter"
        :key="filter.id"
        :filter="filter"
        :columns="columns"
        @remove="remove(filter)"
      )

  .action.mt-3
    button.btn.btn-sm.btn-info.rounded-0(type="button", @click="add") + Filter

</template>

<script>
import userfilter from './userfilter.vue'

export default {
  name: 'userfilters',
  props: ['filters', 'columns'],
  components: {
    userfilter
  },
  methods: {
    add () {
      this.filters.push({
        id: `filter-${Math.random()}`,
        type: '',
        column: '',
        size: 12
      })
    },

    remove (filter) {
      this.filters.splice(this.filters.indexOf(filter), 1)
    }
  }
}
</script>

<style lang="sass" scoped>
.w-1
  width: 1%
</style>
