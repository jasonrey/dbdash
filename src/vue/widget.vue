<template lang="pug">
.widget.d-flex.flex-column.h-100.p-3
  .move-handle
    svg(width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
      polyline(points="5 9 2 12 5 15")
      polyline(points="9 5 12 2 15 5")
      polyline(points="15 19 12 22 9 19")
      polyline(points="19 9 22 12 19 15")
      line(x1="2" y1="12" x2="22" y2="12")
      line(x1="12" y1="2" x2="12" y2="22")


  .actions
    router-link.btn.btn-link.text-info.px-1(
      :to="`/project/${$route.params.projectId}/dashboard/${$route.params.dashboardId}/widget/${widget.id}/settings`"
      v-if="widget.type !== 'empty'"
    )
      svg(width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        circle(cx="12" cy="12" r="3")
        path(d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z")


    a.btn.btn-link.text-warning.px-1(href="javascript:;", @click="$emit('remove')")
      svg(width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round")
        polyline(points="3 6 5 6 21 6")
        path(d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2")
        line(x1="10" y1="11" x2="10" y2="17")
        line(x1="14" y1="11" x2="14" y2="17")


  h3 {{ widget.name }}

  .col.p-0(
    :is="widget.type",
    :widget="widget",
    :project="project",
    :dashboardId="dashboardId",
    @created="$emit('created')"
  )
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
