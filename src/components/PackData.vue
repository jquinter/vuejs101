<template>
  <div>
    <h1>Circle Pack in D3</h1>
    <h2>{{ msg }}</h2>
    <svg
      :height='height'
      :width='width'
    >
      <g transform='translate(50,50)'>
        <circle
          v-for='c in output'
          :key='c.id'
          :r='c.r'
          :cx='c.x'
          :cy='c.y'
          :fill='c.fill'
          :stroke='c.stroke'
        >
        </circle>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'PackChart',
  props: ['tweetData', 'treeMapData'],
  data () {
    return {
      msg: '👋 from the Chart Component',
      height: 600,
      width: 600
    }
  },
  created () {
    this.colourScale = d3
      .scaleOrdinal()
      .range(['#5EAFC6', '#FE9922', '#93c464', '#75739F'])
  },
  methods: {
    packChart () {
      const packChart = d3.pack()
      packChart.size([500, 500])
      packChart.padding(10)
      const output = packChart(this.packData).descendants()
      return output.map((d, i) => {
        const fill = this.colourScale(d.depth)
        return {
          id: i + 1,
          r: d.r,
          x: d.x,
          y: d.y,
          fill,
          stroke: 'grey'
        }
      })
    }
  },
  computed: {
    packData () {
      const nestedTweets = d3
        .nest()
        .key(d => d.user)
        .entries(this.tweetData)
      const packableTweets = { id: 'All Tweets', values: nestedTweets }
      return d3
        .hierarchy(packableTweets, d => d.values)
        .sum(d =>
          d.retweets ? d.retweets.length + d.favorites.length + 1 : 1
        )
    },
    output () {
      return this.packChart()
    }
  }
}
</script>

<style scoped>
#chart {
  background: #fff;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.title {
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    margin-top: 6px;
    margin-bottom: 6px;
}
text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

rect.parent {
    pointer-events: none;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}
</style>
