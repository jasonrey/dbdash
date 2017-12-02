<template lang="pug">
div
  .form-group
    label Table
</template>

<script>
import bridge from '../../library/bridge'

export default {
  name: 'tabledata-settings',
  props: ['widget', 'project'],
  created () {
    bridge(this.project.meta.bridge, this.project.identifier).get('tables')
      .then(console.log)
  }
}
</script>
