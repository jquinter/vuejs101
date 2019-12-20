<template>
  <div class="treemap">
    <!-- The SVG structure is explicitly defined in the template with attributes derived from component data -->
    <svg :height="height" style="margin-left: 0px;" :width="width">
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
        <!-- We can use Vue transitions too! -->
        <transition-group name="list" tag="g" class="depth" v-if="selectedNode.id">
          <!-- Generate each of the visible squares at a given zoom level (the current selected node) -->
          <g
            class="children"
            v-for="(children, index) in selectedNode._children"
            :key="'c_' + children.id"
            >

            <!-- Generate the children squares (only visible on hover of a square) -->
            <rect
              v-for="child in children._children"
              class="child"
              :id="child.id"
              :key="child.id"
              :height="y(child.y1) - y(child.y0)"
              :width="x(child.x1) - x(child.x0)"
              :x="x(child.x0)"
              :y="y(child.y0)"
              >
            </rect>

            <!--
              The visible square rect element.
              You can attribute directly an event, that fires a method that changes the current node,
              restructuring the data tree, that reactivly gets reflected in the template.
            -->
            <rect
              class="parent"
              v-on:click="selectNode"
              :id="children.id"
              :key="children.id"
              :x="x(children.x0)"
              :y="y(children.y0)"
              :width="x(children.x1 - children.x0 + children.parent.x0)"
              :height="y(children.y1 - children.y0 + children.parent.y0)"
              :style="{ fill: color(index) }"
              >

              <!-- The title attribute -->
              <title>{{selectedNode.id.slice(4) + '.'}}{{ children.data.name }} | {{ children.value }} permisos</title>
            </rect>

            <!-- The visible square text element with the title and value of the child node -->
            <text
              dy="1em"
              :key="'t_' + children.id"
              :x="x(children.x0) + 6"
              :y="y(children.y0) + 6"
              style="fill-opacity: 1;"
              >
              {{ children.data.name }}
            </text>

            <text
              dy="2.25em"
              :key="'tf_' + children.id"
              :x="x(children.x0) + 6"
              :y="y(children.y0) + 6"
              style="fill-opacity: 1;"
              >

              {{ children.value }} permiso{{ children.value > 1 ? 's': '' }}
            </text>

          </g>
        </transition-group>

        <!-- The top most element, representing the previous node -->
        <g v-if="selectedNode.id" class="grandparent">

          <rect
            :height="margin.top"
            :width="width"
            :y="(margin.top * -1)"
            v-on:click="selectNode"
            :id="parentId">
          </rect>

          <!-- The visible square text element with the id (basically a breadcumb, if you will) -->
          <text
            dy=".65em"
            x="6"
            y="-14">

            {{ selectedNode.id.slice(4) }} en este rol ({{ selectedNode.value }} permisos en {{ selectedNode.children.length }} categorías)
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
/*
Ideas taken from
https://levelup.gitconnected.com/d3-js-and-vue-js-7a6a721eb79f
http://bl.ocks.org/ganeshv/6a8e9ada3ab7f2d88022
https://github.com/albertopereira/vuejs-treemap
*/
import { scaleLinear, scaleOrdinal, schemeCategory20 } from 'd3-scale'
import { json } from 'd3-request'
import { hierarchy, treemap } from 'd3-hierarchy'
import { nest } from 'd3-collection'
// To be explicit about which methods are from D3 let's wrap them around an object
// Is there a better way to do this?
let d3 = {
  nest: nest,
  scaleLinear: scaleLinear,
  scaleOrdinal: scaleOrdinal,
  schemeCategory20: schemeCategory20,
  json: json,
  hierarchy: hierarchy,
  treemap: treemap
}
export default {
  name: 'Treemap',
  props: ['treeMapRawData', 'containerWidth', 'containerHeight'],
  // the component's data
  data () {
    return {
      jsonData: null,
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 480,
      height: 530,
      selected: null,
      color: {}
    }
  },
  // You can do whatever when the selected node changes
  watch: {
    containerHeight (newData, oldData) {
      this.height = newData
      this.width = this.containerWidth
      this.treemap(this.rootNode)
    },
    containerWidth (newData, oldData) {
      this.width = newData
      this.height = this.containerHeight
      this.treemap(this.rootNode)
    },
    selectedNode (newData, oldData) {
      console.log('The selected node changed...')
    }
  },
  // In the beginning...
  mounted () {
    // this.width = this.containerWidth
    // this.height = this.containerHeight

    var that = this
    // An array with colors (can probably be replaced by a vuejs method)
    that.color = d3.scaleOrdinal(d3.schemeCategory20)
    const tempParsedObjtemp = d3.nest()
      .key(function (d) {
        return d.mayor
      }).key(function (d) {
        return d.minor
      }).entries((this.treeMapRawData).map((x) => ({ 'key': x.split('.')[2], 'mayor': x.split('.')[0], 'minor': x.split('.')[1], 'value': 1 })))
      .map(function (group1) {
        return {
          name: group1.key,
          children: group1.values.map(function (group2) {
            return {
              name: group2.key,
              children: group2.values.map(function (group3) {
                return {
                  name: group3.key,
                  value: group3.value
                }
              })
            }
          })
        }
      })
    const temp = JSON.parse(JSON.stringify(tempParsedObjtemp))
    that.jsonData = Object.freeze({ name: 'all', children: temp })
    // loads the data and calls the initialization methods
    /*
    d3.json('../static/flare.json',
      function (error, data) {
        if (error) console.log(error)
        that.jsonData = data
        that.initialize()
        that.accumulate(that.rootNode, that)
        that.treemap(that.rootNode)
      }
    )
    */
    if (that.jsonData) {
      that.initialize()
      that.accumulate(that.rootNode, that)
      that.treemap(that.rootNode)
    }
  },
  // The reactive computed variables that fire rerenders
  computed: {
    /*
    jsonData () {
      // https://stackoverflow.com/questions/37172184/rename-key-and-values-in-d3-nest
      var temp = d3.nest()
        .key(function (d) {
          return d.mayor
        }).key(function (d) {
          return d.minor
        }).entries((this.treeMapRawData).map((x) => ({ 'key': x.split('.')[2], 'mayor': x.split('.')[0], 'minor': x.split('.')[1], 'value': 1 })))
        .map(function (group1) {
          return {
            name: group1.key,
            children: group1.values.map(function (group2) {
              return {
                name: group2.key,
                children: group2.values.map(function (group3) {
                  return {
                    name: group3.key,
                    value: group3.value
                  }
                })
              }
            })
          }
        })
      console.log(temp)
      return { name: 'all', children: temp }
    },
    */

    // The grandparent id
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    // Returns the x position within the current domain
    // Maybe it can be replaced by a vuejs method
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    // Returns the y position within the current domain
    // Maybe it can be replaced by a vuejs method
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    // The D3 function that recursively subdivides an area into rectangles
    treemap () {
      return d3.treemap()
        .size([this.width, this.height])
        .round(false)
        .paddingInner(0)
    },
    // The current selected node
    selectedNode () {
      let node = null
      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)
        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }
      // Recalculates the y and x domains
      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])
      return node
    }
  },
  methods: {
    // Called once, to create the hierarchical data representation
    initialize () {
      let that = this
      if (that.jsonData) {
        that.rootNode = d3.hierarchy(that.jsonData)
          .eachBefore(function (d) { d.id = (d.parent ? d.parent.id + '.' : '') + d.data.name })
          .sum((d) => d.value)
          .sort(function (a, b) {
            return b.height - a.height || b.value - a.value
          })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0
      }
    },
    // Calculates the accumulated value (sum of children values) of a node - its weight,
    // represented afterwards in the area of its square
    accumulate (d, context) {
      d._children = d.children
      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
    },
    // Helper method - gets a node by its id attribute
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    // When a user clicks a square, changes the selected data attribute
    // which fires the computed selectedNode, which in turn finds the Node by the id of the square clicked
    // and the template reflects the changes
    selectNode (event) {
      this.selected = event.target.id
    }
  }
}
</script>

<style scoped>
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
.children:hover text {
  fill: rgb(255, 255, 255);
  font-size: 1em;
  background: white;
}
.children text{
  font-size: 0.89em;
  fill: rgba(255, 255, 255, 0.692);
}
.grandparent text{
  font-size: 0.99em;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

</style>
