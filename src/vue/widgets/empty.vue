<template lang="pug">
.row.p-0.pl-3.m-0
  .col.mb-3.mr-3.border(@click="selectType('tabledata')") Table

</template>

<script>
import api from '../../library/api'

export default {
  name: 'empty-widget',
  props: ['widget', 'dashboardId'],
  data () {
    return {

    }
  },
  methods: {
    selectType (type) {
      this.widget.type = type
      this.widget.meta = {}

      delete this.widget.isNew

      api.put('widget', {
        dashboardId: this.dashboardId,
        name: this.widget.name,
        position: JSON.stringify({
          x: this.widget.x,
          y: this.widget.y,
          w: this.widget.w,
          h: this.widget.h
        }),
        type
      })
        .then(res => {
          this.widget.id = res.id

          this.$emit('created')
        })
    }
  }
}
</script>
