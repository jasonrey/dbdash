<template lang="pug">
.conditions(:class="{ group: level, 'ml-3': level > 1, 'mb-1': level }")
  .d-block(v-if="rule && (rule.group === 'and' || rule.group === 'or')")
    span.badge.badge-secondary.rounded-0 {{ rule.group | uppercase }} (
  div(
    v-for="(rule, index) in rules"
    :key="rule.id"
    :is="rule.type"
    :rule="rule"
    :initialrules="rule.initialrules"
    :index="index"
    :level="(level || 0) + 1"
    :class="{ 'mx-0': level }"
  )

  .row(:class="{ 'mx-0': level }")
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-info(href="javascript:;", @click="addCondition") + Condition
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-primary(href="javascript:;", @click="addAND", v-show="rules.length") + AND ()
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-primary(href="javascript:;", @click="addOR", v-show="rules.length") + OR ()
    a.ml-3.col-auto.rounded-0.btn.btn-sm.btn-danger(href="javascript:;", @click="removeLastCondition", v-show="rules.length") - Condition

  .d-block(v-if="rule && (rule.group === 'and' || rule.group === 'or')")
    span.badge.badge-secondary.rounded-0 )
</template>

<script>
import condition from './condition.vue'

export default {
  name: 'conditions',
  props: ['rule', 'level', 'index', 'initialrules'],
  components: {
    condition
  },
  filters: {
    uppercase: value => value.toUpperCase()
  },
  data: () => ({
    rules: []
  }),
  created () {
    if (this.initialrules) {
      this.rules = this.initialrules
    }
  },
  methods: {
    addCondition () {
      this.rules.push({
        id: `rule-${Math.random().toString().slice(2)}`,
        type: 'condition'
      })
    },

    addAND () {
      this.rules.push({
        id: `rule-${Math.random().toString().slice(2)}`,
        type: 'conditions',
        group: 'and',
        initialrules: [{
          id: `rule-${Math.random().toString().slice(2)}`,
          type: 'condition'
        }]
      })
    },

    addOR () {
      this.rules.push({
        id: `rule-${Math.random().toString().slice(2)}`,
        type: 'conditions',
        group: 'or',
        initialrules: [{
          id: `rule-${Math.random().toString().slice(2)}`,
          type: 'condition'
        }]
      })
    },

    removeLastCondition () {

    }
  }
}
</script>

<style lang="sass" scoped>
.conditions.group
  border-left: 3px solid rgba(#17a2b8, 0.5)

  &:hover
    background-color: rgba(#17a2b8, 0.1)

</style>
