<template>
  <div id="app">
    <div v-for="(item, index) in info" :key="index">
      <span>{{index+1}}</span>{{item}}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'axis',

  data () {
    return {
      info: null
    }
  },

  created () {
    // var dataUrl = '/data/roles_detailed_stringify.json'
    var dataUrl = '/data/roles_detailed.json'

    //  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
    axios
      .get(dataUrl)
      .then(
        // response => (console.log(JSON.parse(response.data))),
        response => (this.info = response.data.slice(0, 10)),
        error => console.error(error)
      )
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
