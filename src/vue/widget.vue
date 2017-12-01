<template lang="pug">
.widget.d-flex.flex-column.h-100
  button.close.settings(type="button", @click="$emit('settings')", v-if="widget.type !== 'empty'")
    img(src="images/settings.svg")
  button.close(type="button", @click="$emit('remove')")
    img(src="images/x.svg")

  h3.p-3.m-0 {{ widget.name }}

  .col(:is="widget.type", :widget="widget", :dashboardId="dashboardId", @created="$emit('created')")
</template>

<script>
import empty from './widgets/empty.vue'
import tabledata from './widgets/tabledata.vue'

export default {
  name: 'widget',
  props: ['widget', 'dashboardId', 'project'],
  components: {
    empty,
    tabledata
  }
}
</script>
