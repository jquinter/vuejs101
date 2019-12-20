<template lang='pug'>
#chart
  svg(:height='height', :width='width')
    g.depth
    g.grandparent
</template>

<script>
import * as d3 from 'd3'

let margin = { top: 24, right: 0, bottom: 0, left: 0 }
let rootname = 'TOP'
let format = ',d'
let width = 960
let height = 500
let theight = 36 + 16
let treemap
let grandparent
let x = d3.scale.linear()
  .domain([0, width])
  .range([0, width])

let y = d3.scale.linear()
  .domain([0, height])

let formatNumber = function (n) {
  return d3.format(format, n)
}

let color = d3.scale.category20c()

let transitioning = false

let svg

function initialize (root) {
  root.x = root.y = 0
  root.dx = width
  root.dy = height
  root.depth = 0
}

// Aggregate the values for internal nodes. This is normally done by the
// treemap layout, but not here because of our custom implementation.
// We also take a snapshot of the original children (_children) to avoid
// the children being overwritten when when layout is computed.
function accumulate (d) {
  /*
  return (d._children = d.values)
        ? d.value = d.values.reduce(function (p, v) { return p + accumulate(v); }, 0)
        : d.value;
  */
  d._children = d.values
  if (d._children) {
    d.value = d.values.reduce(function (p, v) { return p + accumulate(v) }, 0)
  }
  return d.value
}

// Compute the treemap layout recursively such that each group of siblings
// uses the same size (1×1) rather than the dimensions of the parent cell.
// This optimizes the layout for the current zoom state. Note that a wrapper
// object is created for the parent node for each group of siblings so that
// the parent’s dimensions are not discarded as we recurse. Since each group
// of sibling was laid out in 1×1, we must rescale to fit using absolute
// coordinates. This lets us use a viewport to zoom.
function layout (d) {
  if (d._children) {
    treemap.nodes({ _children: d._children })
    d._children.forEach(function (c) {
      c.x = d.x + c.x * d.dx
      c.y = d.y + c.y * d.dy
      c.dx *= d.dx
      c.dy *= d.dy
      c.parent = d
      layout(c)
    })
  }
}

function text (text) {
  text.selectAll('tspan')
    .attr('x', function (d) { return x(d.x) + 6 })
  text.attr('x', function (d) { return x(d.x) + 6 })
    .attr('y', function (d) { return y(d.y) + 6 })
    .style('opacity', function (d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0 })
}

function text2 (text) {
  text.attr('x', function (d) { return x(d.x + d.dx) - this.getComputedTextLength() - 6 })
    .attr('y', function (d) { return y(d.y + d.dy) - 6 })
    .style('opacity', function (d) { return this.getComputedTextLength() < x(d.x + d.dx) - x(d.x) ? 1 : 0 })
}

function rect (rect) {
  rect.attr('x', function (d) { return x(d.x) })
    .attr('y', function (d) { return y(d.y) })
    .attr('width', function (d) { return x(d.x + d.dx) - x(d.x) })
    .attr('height', function (d) { return y(d.y + d.dy) - y(d.y) })
}

function name (d) {
  return d.parent
    ? name(d.parent) + ' / ' + d.key + ' (' + formatNumber(d.value) + ')'
    : d.key + ' (' + formatNumber(d.value) + ')'
}

let obj = {
  name: 'TreeMap',
  props: ['treeMapRawData'],
  data () {
    return {
      msg: '👋 from the Chart Component',
      width: 0,
      height: 0,
      chart: null,
      root: {}
    }
  },
  computed: {
    treeMapData () {
      return d3.nest()
        .key(function (d) {
          return d.mayor
        }).key(function (d) {
          return d.minor
        }).entries((this.treeMapRawData).map((x) => ({ 'key': x.split('.')[2], 'mayor': x.split('.')[0], 'minor': x.split('.')[1], 'value': 1 })))
    }
  },
  created () {
    this.width = width - margin.left - margin.right
    this.height = height - margin.top - margin.bottom - theight

    treemap = d3.layout.treemap()
      .children(function (d, depth) { return depth ? null : d._children })
      .sort(function (a, b) { return a.value - b.value })
      .ratio(this.height / this.width * 0.5 * (1 + Math.sqrt(5)))
      .round(false)

    svg = d3.select('#chart svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.bottom + margin.top)
      .style('margin-left', -margin.left + 'px')
      .style('margin.right', -margin.right + 'px')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .style('shape-rendering', 'crispEdges')

    grandparent = svg.append('g')
      .attr('class', 'grandparent')

    grandparent.append('rect')
      .attr('y', -margin.top)
      .attr('width', this.width)
      .attr('height', margin.top)

    grandparent.append('text')
      .attr('x', 6)
      .attr('y', 6 - margin.top)
      .attr('dy', '.75em')

    if (this.treeMapData instanceof Array) {
      this.root = { key: rootname, values: this.treeMapData }
    } else {
      this.root = this.treeMapData
    }

    initialize(this.root)
    accumulate(this.root)
    layout(this.root)
    console.log(this.root)
    this.display(this.root)
  },
  methods: {
    display (d) {
      grandparent
        .datum(d.parent)
        .on('click', transition)
        .select('text')
        .text(name(d))

      var g1 = svg.insert('g', '.grandparent')
        .datum(d)
        .attr('class', 'depth')

      var g = g1.selectAll('g')
        .data(d._children)
        .enter().append('g')

      g.filter(function (d) { return d._children })
        .classed('children', true)
        .on('click', transition)

      var children = g.selectAll('.child')
        .data(function (d) { return d._children || [d] })
        .enter().append('g')

      children.append('rect')
        .attr('class', 'child')
        .call(rect)
        .append('title')
        .text(function (d) { return d.key + ' (' + formatNumber(d.value) + ')' })

      children.append('text')
        .attr('class', 'ctext')
        .text(function (d) { return d.key })
        .call(text2)

      g.append('rect')
        .attr('class', 'parent')
        .call(rect)

      var t = g.append('text')
        .attr('class', 'ptext')
        .attr('dy', '.75em')

      t.append('tspan')
        .text(function (d) { return d.key })

      t.append('tspan')
        .attr('dy', '1.0em')
        .text(function (d) { return formatNumber(d.value) })

      t.call(text)

      g.selectAll('rect')
        .style('fill', function (d) { return color(d.key) })

      function transition (d) {
        if (transitioning || !d) return
        transitioning = true

        let g2 = this.display(d)
        let t1 = g1.transition().duration(750)
        let t2 = g2.transition().duration(750)

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx])
        y.domain([d.y, d.y + d.dy])

        // Enable anti-aliasing during the transition.
        svg.style('shape-rendering', null)

        // Draw child nodes on top of parent nodes.
        svg.selectAll('.depth').sort(function (a, b) { return a.depth - b.depth })

        // Fade-in entering text.
        g2.selectAll('text').style('fill-opacity', 0)

        // Transition to the new view.
        t1.selectAll('.ptext').call(text).style('fill-opacity', 0)
        t1.selectAll('.ctext').call(text2).style('fill-opacity', 0)
        t2.selectAll('.ptext').call(text).style('fill-opacity', 1)
        t2.selectAll('.ctext').call(text2).style('fill-opacity', 1)
        t1.selectAll('rect').call(rect)
        t2.selectAll('rect').call(rect)

        // Remove the old node when the transition is finished.
        t1.remove().each('end', function () {
          svg.style('shape-rendering', 'crispEdges')
          transitioning = false
        })
      }

      return g
    }
  }
}
export default obj
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
