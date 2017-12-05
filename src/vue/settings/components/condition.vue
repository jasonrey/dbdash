<template lang="pug">
.form-group.row.mr-0
  .col-1.pr-0
    span.badge.badge-secondary.rounded-0(v-if="index && rule.connector") {{ rule.connector | uppercase }}

  .col.pr-0
    select.form-control.form-control-sm(v-model="rule.column")
      option(
        v-for="column in columns"
        :key="column.name"
        :value="column.name"
      ) {{ column.name }}

  .col-1.pr-0
    select.form-control.form-control-sm(v-model="rule.comparison")
      option(value="=") =
      option(value="!=") !=
      option(value="<") &lt;
      option(value=">") &gt;
      option(value="<=") &lt;=
      option(value=">=") &gt;=
      option(value="in") IN
      option(value="not in") NOT IN
      option(value="like") LIKE
      option(value="not like") NOT LIKE
      option(value="is null") IS NULL
      option(value="is not null") IS NOT NULL

  .col.pr-0
    .input-group
      input.form-control.form-control-sm(v-model="rule.value")
      span.input-group-btn
        button.btn.btn-sm(type="button", :class="{ 'btn-outline-success': !rule.raw, 'btn-success': rule.raw }", @click="rule.raw = !rule.raw") Raw
</template>

<script>
export default {
  props: ['rule', 'index', 'columns'],
  filters: {
    uppercase: value => value.toUpperCase()
  },
  created () {
    if (!this.rule.comparison) {
      this.rule.comparison = '='
    }
  }
}
</script>
