<template lang="pug">
.form-group.row.mr-0
  .col-1.pr-0
    span.badge.badge-secondary.rounded-0(v-if="index") AND

  .col.pr-0
    select.form-control.form-control-sm(v-model="rule.column")
      option(value="column 1") column 1
      option(value="column 2") column 2

  .col-1.pr-0
    select.form-control.form-control-sm(v-model="rule.comparison")
      option(value="=") =
      option(value="!=") !=
      option(value="<") &lt;
      option(value=">") &gt;

  .col.pr-0
    input.form-control.form-control-sm(v-model="rule.value")
</template>

<script>
export default {
  props: ['rule', 'index'],
  created () {
    if (!this.rule.method) {
      this.rule.comparison = '='
    }
  }
}
</script>
