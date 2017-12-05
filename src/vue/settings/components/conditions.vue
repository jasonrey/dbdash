<template lang="pug">
.conditions(:class="{ group: level, 'ml-3': level > 1, 'mb-1': level }", :data-level="level")
  .d-block(v-if="rule && rule.connector")
    span.badge.badge-secondary.rounded-0 {{ rule.connector | uppercase }} (
  div(
    v-for="(rule, index) in rules"
    :key="rule.id"
    :is="rule.type"
    :rule="rule"
    :rules="rule.rules"
    :index="index"
    :level="(level || 0) + 1"
    :class="{ 'mx-0': level }"
    :columns="columns"
  )

  .row(:class="{ 'mx-0': level }")
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-info(href="javascript:;", @click="addCondition()", v-if="!rules.length") + Condition
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-info(href="javascript:;", @click="addCondition('and')", v-if="rules.length") + AND
    a.ml-1.col-auto.rounded-0.btn.btn-sm.btn-info(href="javascript:;", @click="addCondition('or')", v-if="rules.length") + OR
    a.ml-1.col-auto.rounded-0.btn.btn-sm.btn-primary(href="javascript:;", @click="addGroup('and')", v-show="rules.length") + AND ()
    a.ml-1.col-auto.rounded-0.btn.btn-sm.btn-primary(href="javascript:;", @click="addGroup('or')", v-show="rules.length") + OR ()
    a.ml-1.col-auto.rounded-0.btn.btn-sm.btn-danger(href="javascript:;", @click="removeLastCondition", v-show="(level > 0 && rules.length > 1) || (level === 0 && rules.length)") - Condition

  .d-block(v-if="rule && (rule.connector === 'and' || rule.connector === 'or')")
    span.badge.badge-secondary.rounded-0 )
</template>

<script>
import condition from './condition.vue'

export default {
  name: 'conditions',
  props: ['rule', 'level', 'index', 'rules', 'columns'],
  components: {
    condition
  },
  filters: {
    uppercase: value => value.toUpperCase()
  },
  methods: {
    addCondition (connector) {
      const rule = {
        id: `rule-${Math.random().toString().slice(2)}`,
        type: 'condition'
      }

      if (connector) {
        rule.connector = connector
      }

      this.rules.push(rule)
    },

    addGroup (connector) {
      this.rules.push({
        id: `rule-${Math.random().toString().slice(2)}`,
        type: 'conditions',
        connector,
        rules: [{
          id: `rule-${Math.random().toString().slice(2)}`,
          type: 'condition'
        }]
      })
    },

    removeLastCondition () {
      this.rules.splice(this.rules.length - 1, 1)
    }
  }
}
</script>

<style lang="sass" scoped>
.conditions.group
  border-left: 3px solid rgba(#17a2b8, 0.5)
  background-color: white

  &:hover
    background-color: rgba(#17a2b8, 0.1)

</style>
