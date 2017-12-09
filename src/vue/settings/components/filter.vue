<template lang="pug">
tr
  td
    select.form-control.form-control-sm(v-model="filter.type")
      option(value="search") Search
      option(value="datepicker") Datepicker
      option(value="select") Select

  td
    select.form-control.form-control-sm(v-model="filter.column")
      option(
        v-for="column in columns"
        :key="column.name"
        :value="column.name"
      ) {{ column.name }}

  td
    .btn-group
      button.btn.btn-sm(
        type="button"
        :class="{ 'btn-secondary': size === 3, 'btn-outline-secondary': size !== 3 }"
        @click="size = 3") 1/4
      button.btn.btn-sm(
        type="button"
        :class="{ 'btn-secondary': size === 6, 'btn-outline-secondary': size !== 6 }"
        @click="size = 6") 1/2
      button.btn.btn-sm(
        type="button"
        :class="{ 'btn-secondary': size === 12, 'btn-outline-secondary': size !== 12 }"
        @click="size = 12") 1

  td
    button.btn.btn-sm.btn-outline-warning(type="button", @click="remove(filter)")
      svg(width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        polyline(points="3 6 5 6 21 6")
        path(d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")
        line(x1="10" y1="11" x2="10" y2="17")
        line(x1="14" y1="11" x2="14" y2="17")
</template>

<script>
export default {
  name: 'filter',
  props: ['filter'],
  data: () => ({
    size: 12
  }),
  watch: {
    size (newValue) {
      this.filter.size = newValue
    }
  },
  created () {
    this.size = this.filter.size
  }
}
</script>
