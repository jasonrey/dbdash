<template lang="pug">
#dashboard
  grid-layout(
    :layout="widgets"
    :col-num="4"
    :row-height="64"
    :is-draggable="true"
    :is-resizable="true"
    :vertical-compact="true"
    :margin="[16, 16]"
    :use-css-transforms="true"
  )
    grid-item.border(
      v-for="widget in widgets"
      :key="widget.i"
      :x="widget.x"
      :y="widget.y"
      :w="widget.w"
      :h="widget.h"
      :i="widget.i"
      @resized="resizeWidget"
      @moved="moveWidget"
    )
      widget(
        :widget="widget"
        :dashboardId="dashboardId"
        :project="project"
        @remove="removeWidget(widget)"
        @settings="openSettings(widget)"
        @created="saveAllPositions"
      )

  .px-3
    button.btn.btn-secondary.btn-block.rounded-0(@click="addWidget") +
</template>

<script>
import {GridLayout, GridItem} from 'vuegridlayout'
import api from '../library/api'
import widget from './widget.vue'

export default {
  props: ['dashboardId', 'project'],
  components: {
    GridLayout,
    GridItem,
    widget
  },
  data () {
    return {
      dashboard: {},
      widgets: [],
      addButtonPosition: {
        id: 'addbutton',
        x: 0,
        y: 0,
        w: 4,
        h: 1,
        i: 0,
        type: 'addbutton',
        isResizable: false,
        isDraggable: false
      },
      index: 0
    }
  },
  watch: {
    '$route' (to, from) {
      this.initDashboard()
    }
  },
  created () {
    this.initDashboard()
  },
  methods: {
    initDashboard () {
      return Promise.all([
        api.get(`dashboard/${this.dashboardId}`)
          .then(res => {
            this.dashboard = res
          }),

        api.get(`dashboard/${this.dashboardId}/widgets`)
          .then(res => {
            this.widgets = res.map((widget, i) => {
              const position = JSON.parse(widget.position)

              this.index++

              return {
                id: widget.id,
                name: widget.name,
                x: position.x,
                y: position.y,
                w: position.w,
                h: position.h,
                i,
                type: widget.type
              }
            })
          })
      ])
    },

    addWidget () {
      const id = 'w-' + Math.random().toString().slice(2) + Date.now().toString()

      const y = this.widgets.reduce((max, widget) => {
        if (widget.y > max) {
          max = widget.y
        }

        return max
      }, 0) + 2

      this.widgets.push({
        id,
        name: 'New Widget',
        x: 0,
        y,
        w: 4,
        h: 2,
        i: ++this.index,
        type: 'empty',
        isNew: true
      })
    },

    removeWidget (widget) {
      if (widget.isNew) {
        return this.widgets.splice(this.widgets.indexOf(widget), 1)
      }

      const result = window.confirm('Are you sure you want to delete this widget?')

      if (result) {
        this.widgets.splice(this.widgets.indexOf(widget), 1)

        api.del(`widget/${widget.id}`)
          .then(() => this.saveAllPositions())
      }
    },

    resizeWidget (i, h, w, x, y) {
      const widget = this.widgets.find(widget => widget.i === i)

      if (widget.isNew) {
        return
      }

      this.saveAllPositions()
    },

    moveWidget (i, x, y) {
      const widget = this.widgets.find(widget => widget.i === i)

      if (widget.isNew) {
        return
      }

      this.saveAllPositions()
    },

    saveAllPositions () {
      this.widgets
        .filter(widget => !widget.isNew)
        .map(widget => {
          api.post(`widget/${widget.id}`, {
            position: JSON.stringify({
              x: widget.x,
              y: widget.y,
              w: widget.w,
              h: widget.h
            })
          })
        })
    },

    openSettings (widget) {
      this.$router.push(`/project/${this.$route.params.projectId}/dashboard/${this.dashboard.id}/widget/${widget.id}/settings`)
    }
  }
}
</script>

<style lang="sass">
#dashboard
  overflow-y: auto

.widget
  overflow-y: auto

  .close
    position: absolute
    top: 0
    right: 0
    width: 30px
    height: 30px

  .settings
    right: 30px
</style>
