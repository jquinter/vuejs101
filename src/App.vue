<template>
  <div id="app">
    <vue-json-pretty
        v-if="renderOK"
        :path="path"
        :data="json"
        :deep="deep"
        :show-double-quotes="showDoubleQuotes"
        :highlight-mouseover-node="highlightMouseoverNode"
        :highlight-selected-node="highlightSelectedNode"
        :show-length="showLength"
        :show-line="showLine"
        :select-on-click-node="selectOnClickNode"
        :path-selectable="((path, data) => typeof data !== 'number')"
        :selectable-type="selectableType"
        :show-select-controller="showSelectController"
        v-model="value"
        @click="handleClick(...arguments, 'complexTree')">
    </vue-json-pretty>
    <h3>v-model:</h3>
    <div>{{value}}</div>
    <h3>Current Click:</h3>
    <div>path: {{itemPath}}</div>
    <div>data: <pre>{{itemData}}</pre></div>
  </div>
</template>

<script>
import axios from 'axios'
import VueJsonPretty from 'vue-json-pretty'

export default {
  name: 'axis',

  components: {
    VueJsonPretty
  },

  data () {
    return {
      info: null,
      renderOK: true,
      value: 'res.error',
      selectableType: 'multiple',
      showSelectController: true,
      showLength: true,
      showLine: true,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      highlightSelectedNode: true,
      selectOnClickNode: true,
      path: 'res',
      deep: 3,
      itemData: {},
      itemPath: ''
    }
  },

  created () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => (this.info = JSON.stringify(response)))
  },

  watch: {
    selectableType (newVal) {
      this.renderOK = false
      if (newVal === 'single') {
        this.value = 'res.error'
      } else if (newVal === 'multiple') {
        this.value = ['res.error', 'res.data[0].title']
      }
      // 重新渲染, 因为2中情况的v-model格式不同
      this.$nextTick(() => {
        this.renderOK = true
      })
    }
  },
  computed: {
    json () {
      try {
        return JSON.parse(this.info)
      } catch (err) {
        return this.cache || this.data
      }
    }
  },

  methods: {
    handleClick (path, data, treeName = '') {
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    },
    handleChange (newVal, oldVal) {
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: justify;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
