<template lang="pug">
.number-widget.d-flex.flex-column
  .row.justify-content-center(v-if="loading") Loading...

  p.mt-2.mb-0(v-if="header") {{ header }}

  .col.row.align-items-center.justify-content-center.m-auto(v-show="!loading")
    .pre {{ pre }}
    h2.col-auto.my-auto {{ value }}
    .post {{ post }}

  p.small.mt-0.mb-2(v-if="footer") {{ footer }}
</template>

<script>
import api from '../../library/api'

export default {
  name: 'number-widget',
  props: ['widget'],
  data () {
    return {
      pre: '',
      post: '',
      value: '',
      header: '',
      footer: '',

      loading: true
    }
  },
  created () {
    this.init()
  },
  watch: {
    '$route' (to, from) {
      if (from.name === 'widgetSettings' && parseInt(from.params.widgetId) === this.widget.id) {
        this.getWidget()
          .then(() => this.init())
      }
    }
  },
  methods: {
    init () {
      this.loading = true

      this.pre = this.widget.meta.pre
      this.post = this.widget.meta.post

      this.header = this.widget.meta.header
      this.footer = this.widget.meta.footer

      this.value = 100

      this.loading = false
    },

    getWidget () {
      return api(`widget/${this.widget.id}`)
        .then(res => {
          this.widget.meta = res.meta
        })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
