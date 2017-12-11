<template lang="pug">
div.form-group
  label {{ this.filter.label }}
  flatpickr.form-control.form-control-sm(v-model="date")
</template>

<script>
import flatpickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  props: ['filter'],
  components: {
    flatpickr
  },
  data: () => ({
    date: ''
  }),
  watch: {
    date (newValue) {
      this.filter.value = newValue === '' ? undefined : newValue

      this.$emit('change', this.filter, newValue)
    }
  }
}
</script>
